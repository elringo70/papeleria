import { z } from 'zod';

export const orderSchema = z.object({
	products: z.string().array({ required_error: 'Envie al menos un producto' }).optional()
});
