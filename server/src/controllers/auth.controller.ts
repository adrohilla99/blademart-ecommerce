import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getUserById } from '../services/auth.service';
import { sendSuccess, sendCreated } from '../utils/response';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await registerUser(req.body);
    sendCreated(res, result, 'Account created successfully');
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await loginUser(req.body);
    sendSuccess(res, result, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await getUserById(req.user!.userId);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}
