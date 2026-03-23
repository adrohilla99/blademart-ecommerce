import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, imageUrl: true },
          },
        },
      },
    },
  });

  return orders.map((o) => ({
    ...o,
    totalAmount: o.totalAmount.toString(),
    items: o.items.map((item) => ({
      ...item,
      unitPrice: item.unitPrice.toString(),
    })),
  }));
}

export async function getOrderById(orderId: string, userId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              imageUrl: true,
              category: true,
              brand: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return {
    ...order,
    totalAmount: order.totalAmount.toString(),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: item.unitPrice.toString(),
    })),
  };
}
