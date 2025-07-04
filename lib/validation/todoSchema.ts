import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string({ message: 'Title cannot be empty' }).min(1, 'Title is required'),
  description: z.string({ message: 'Description cannot be empty' }).optional(),
  status: z.enum(['ready', 'in-progress', 'completed'], {
    errorMap: () => ({ message: 'Invalid status' }),
  }),
});

export type TodoFormData = z.infer<typeof todoSchema>;