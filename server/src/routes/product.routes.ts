import { Router } from 'express';
import { listProducts, getProduct, listCategories } from '../controllers/product.controller';
import { validate } from '../middleware/validate.middleware';
import { productQuerySchema } from '../validators/product.validator';

const router = Router();

router.get('/', validate(productQuerySchema, 'query'), listProducts);
router.get('/categories', listCategories);
router.get('/:slug', getProduct);

export default router;
