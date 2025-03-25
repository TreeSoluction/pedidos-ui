import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string(),
  category: z.string(),
  purchase_price: z.number().optional(),
  buy_price: z.number().optional(),
});

export type CreateProductFormData = z.infer<typeof CreateProductSchema>;

export const EditProductSchema = z.object({
  name: z.string(),
  category: z.string(),
  purchase_price: z.number().optional(),
  buy_price: z.number().optional(),
});

export type EditProductFormData = z.infer<typeof EditProductSchema>;
