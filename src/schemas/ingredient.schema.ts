import { z } from 'zod';

export const CreateIngredientSchema = z.object({
  name: z.string().nonempty(),
  sold_price: z.number().nonnegative(),
});

export type CreateIngredientFormData = z.infer<typeof CreateIngredientSchema>;

export const EditIngredientSchema = z.object({
  name: z.string().nonempty(),
  sold_price: z.number().nonnegative(),
});

export type EditIngredientFormData = z.infer<typeof EditIngredientSchema>;
