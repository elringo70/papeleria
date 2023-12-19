import { z } from 'zod';

export const orderSchema = z.object({
	customer: z.any(),
	paymentCash: z.number({
		required_error: 'Campo efectivo es requerido'
	}),
	paymentCreditDebit: z.number({
		required_error: 'Campo debito es requerido'
	}),
	paymentETransfer: z.number({
		required_error: 'Campo transferencia es requerido'
	}),
	products: z.array(),
	status: z.boolean(),
	delivered: z.boolean(),
	customerPayment: z.number({
		required_error: 'Campo pago_cliente es requerido'
	}),
	change: z.number({
		required_error: 'Campo cambio es requerido'
	}),
	total: z.number({
		required_error: 'Campo total es requerido'
	})
});

export const findProductSchema = z.object({
	product: z.string()
});
