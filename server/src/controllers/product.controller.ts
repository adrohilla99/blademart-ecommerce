import { Request, Response, NextFunction } from 'express';
import { getProducts, getProductBySlug, getCategories } from '../services/product.service';
import { sendSuccess } from '../utils/response';

export async function listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await getProducts(req.query as never);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await getProductBySlug(req.params.slug);
    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
}

export async function listCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await getCategories();
    sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
}
