import { Router } from 'express';
import { listOrders, getOrder } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, listOrders);
router.get('/:id', authenticate, getOrder);

export default router;
