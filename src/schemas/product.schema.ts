import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().nonempty('Campo de nome não pode ser vazio.'),
  category: z.string().nonempty('Campo de categoria não pode ser vazio.'),
  sold_price: z.string().optional(),
  buy_price: z.string().optional(),
});

export type CreateProductFormData = z.infer<typeof CreateProductSchema>;

export const EditProductSchema = z.object({
  name: z.string().nonempty('Campo de nome não pode ser vazio.'),
  category: z.string().nonempty('Campo de categoria não pode ser vazio.'),
  sold_price: z.string().optional(),
  buy_price: z.string().optional(),
});

export type EditProductFormData = z.infer<typeof EditProductSchema>;
