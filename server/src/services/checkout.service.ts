import { prisma } from '../config/database';
import { stripe } from '../config/stripe';
import { AppError } from '../middleware/error.middleware';
import { CreateCheckoutSessionInput } from '../validators/checkout.validator';
import { env } from '../config/env';

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
  userId: string
): Promise<{ url: string; sessionId: string }> {
  // Validate products exist and have sufficient stock server-side
  const productIds = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    throw new AppError('One or more products not found', 404);
  }

  // Verify stock availability
  for (const item of input.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new AppError(`Product ${item.productId} not found`, 404);
    if (product.stock < item.quantity) {
      throw new AppError(
        `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        400
      );
    }
  }

  // Build line items from server-authoritative product data (never trust client prices)
  const lineItems = input.items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          description: product.description.substring(0, 500),
          images: [product.imageUrl],
          metadata: { productId: product.id },
        },
        unit_amount: Math.round(Number(product.price) * 100), // cents
      },
      quantity: item.quantity,
    };
  });

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: `${env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.CLIENT_URL}/checkout/cancel`,
    metadata: {
      userId,
      items: JSON.stringify(input.items),
    },
  });

  if (!session.url) {
    throw new AppError('Failed to create checkout session', 500);
  }

  return { url: session.url, sessionId: session.id };
}

export async function handleWebhook(
  payload: Buffer,
  signature: string,
  webhookSecret: string
): Promise<void> {
  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    throw new AppError('Invalid webhook signature', 400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as import('stripe').Stripe.Checkout.Session;
    await fulfillOrder(session);
  }
}

export async function fulfillOrder(
  session: import('stripe').Stripe.Checkout.Session
): Promise<void> {
  if (!session.metadata?.userId || !session.metadata?.items) {
    throw new AppError('Missing session metadata', 400);
  }

  const userId = session.metadata.userId;
  const items: Array<{ productId: string; quantity: number }> = JSON.parse(
    session.metadata.items
  );

  // Idempotent - skip if order already exists for this session
  const existingOrder = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
  });

  if (existingOrder) return;

  // Fetch server-authoritative prices
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const totalAmount = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + Number(product.price) * item.quantity;
  }, 0);

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        stripeSessionId: session.id,
        status: 'PAID',
        totalAmount,
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: product.price,
            };
          }),
        },
      },
    });

    // Decrement stock
    await Promise.all(
      items.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    return order;
  });
}

export async function verifyAndFulfillSession(
  sessionId: string,
  userId: string
): Promise<{ alreadyFulfilled: boolean }> {
  // Check if already fulfilled
  const existingOrder = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
  });

  if (existingOrder) {
    return { alreadyFulfilled: true };
  }

  // Retrieve session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  });

  if (session.payment_status !== 'paid') {
    throw new AppError('Payment not completed', 402);
  }

  // Verify session belongs to this user
  if (session.metadata?.userId !== userId) {
    throw new AppError('Unauthorized', 403);
  }

  await fulfillOrder(session);

  return { alreadyFulfilled: false };
}
