import { Request, Response, NextFunction } from 'express';
import { getUserOrders, getOrderById } from '../services/order.service';
import { sendSuccess } from '../utils/response';

export async function listOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await getUserOrders(req.user!.userId);
    sendSuccess(res, orders);
  } catch (error) {
    next(error);
  }
}

export async function getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await getOrderById(req.params.id, req.user!.userId);
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
}
