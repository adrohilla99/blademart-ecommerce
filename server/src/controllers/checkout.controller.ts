import { Request, Response, NextFunction } from 'express';
import { createCheckoutSession, handleWebhook, verifyAndFulfillSession } from '../services/checkout.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middleware/error.middleware';
import { env } from '../config/env';

export async function createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await createCheckoutSession(req.body, req.user!.userId);
    sendSuccess(res, result, 'Checkout session created');
  } catch (error) {
    next(error);
  }
}

export async function stripeWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      throw new AppError('Missing Stripe signature', 400);
    }

    if (!env.STRIPE_WEBHOOK_SECRET) {
      throw new AppError('Webhook secret not configured', 500);
    }

    await handleWebhook(req.body as Buffer, signature, env.STRIPE_WEBHOOK_SECRET);
    res.json({ received: true });
  } catch (error) {
    next(error);
  }
}

export async function verifySession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { sessionId } = req.params;
    const result = await verifyAndFulfillSession(sessionId, req.user!.userId);
    sendSuccess(res, result, 'Session verified');
  } catch (error) {
    next(error);
  }
}
