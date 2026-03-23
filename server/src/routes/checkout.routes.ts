import { Router } from 'express';
import { createSession, stripeWebhook, verifySession } from '../controllers/checkout.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCheckoutSessionSchema } from '../validators/checkout.validator';

const router = Router();

// Raw body parsing for /api/checkout/webhook is handled globally in app.ts
// before the JSON body parser, ensuring req.body is a Buffer for Stripe verification.
router.post('/webhook', stripeWebhook);

router.post(
  '/create-session',
  authenticate,
  validate(createCheckoutSessionSchema),
  createSession
);

router.get('/verify/:sessionId', authenticate, verifySession);

export default router;
