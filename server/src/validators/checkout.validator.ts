import { z } from 'zod';

export const createCheckoutSessionSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().cuid('Invalid product ID'),
        quantity: z.number().int().min(1).max(100),
      })
    )
    .min(1, 'Cart must have at least one item')
    .max(50, 'Cart cannot exceed 50 items'),
});

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;
