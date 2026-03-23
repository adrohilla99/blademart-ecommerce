import { z } from 'zod';

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'rating']).optional(),
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? Math.min(parseInt(val, 10), 50) : 12)),
  featured: z
    .string()
    .optional()
    .transform(val => val === 'true'),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
