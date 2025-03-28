import { z } from 'zod';

export const CreateOrderSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
});

export type CreateOrderFormData = z.infer<typeof CreateOrderSchema>;

export const EditOrderSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
});

export type EditOrderFormData = z.infer<typeof EditOrderSchema>;
