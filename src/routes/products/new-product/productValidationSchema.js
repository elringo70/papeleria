import { z } from 'zod';

export const productSchema = z
	.object({
		_id: z
			.string({ required_error: 'Campo requerido' })
			.min(1, { message: 'Demasiado corto' })
			.max(49, { message: 'Demasiado largo' })
			.trim(),

		product: z
			.string({ required_error: 'Campo requerido' })
			.min(3, { message: 'Demasiado corto' })
			.trim()
			.superRefine((val, ctx) => {
				const parsed = parseInt(val);
				if (!isNaN(parsed)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Ingrese un nombre valido'
					});
				}
			}),

		model: z
			.string()
			.min(3, { message: 'Demasiado corto' })
			.max(64, { message: 'Demasiado largo' })
			.trim()
			.or(z.literal(''))
			.superRefine((val, ctx) => {
				const parsed = parseInt(val);
				if (!isNaN(parsed)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Ingrese un nombre valido'
					});
				}
			}),

		brand: z
			.string()
			.min(3, { message: 'Demasiado corto' })
			.max(64, { message: 'Demasiado largo' })
			.trim()
			.or(z.literal(''))
			.superRefine((val, ctx) => {
				const parsed = parseInt(val);
				if (!isNaN(parsed)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Ingrese un nombre valido'
					});
				}
			}),

		category: z.string().trim(),

		cost: z.preprocess(
			(val) => Number(val),
			z
				.number({ required_error: 'Campo requerido', invalid_type_error: 'Solo números' })
				.positive({ message: 'Solo números mayores a 0' })
		),

		price: z.preprocess(
			(val) => Number(val),
			z
				.number({ required_error: 'Campo requerido', invalid_type_error: 'Solo números' })
				.positive({ message: 'Solo números mayores a 0' })
		),

		wholesale: z.string().transform((val, ctx) => {
			if (val === '') return val;

			const parsed = parseFloat(val);

			if (isNaN(parsed)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Solo números'
				});

				return z.NEVER;
			}

			return parsed;
		}),

		requiredStock: z.nativeEnum(['on']).nullish(),

		stock: z.optional(
			z.preprocess(
				(val) => Number(val),
				z
					.number({ invalid_type_error: 'Solo números' })
					.positive({ message: 'Solo números mayores a 0' })
			)
		),

		stockMinimum: z.optional(
			z.preprocess(
				(val) => Number(val),
				z
					.number({ invalid_type_error: 'Solo números' })
					.positive({ message: 'Solo números mayores a 0' })
			)
		)
	})

	.superRefine((val, ctx) => {
		if (val.cost > val.price) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'El costo debe ser menor al precio',
				path: ['cost']
			});
		}

		if (val.price < val.wholesale && val.wholesale !== 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Mayoreo debe ser menor al precio',
				path: ['wholesale']
			});
		}
	})

	.superRefine((val, ctx) => {
		if (val.requiredStock === 'on' && (val.stock === '' || val.stockMinimum === '')) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Inventario requerido',
				path: ['stock']
			});

			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Inventario requerido',
				path: ['stockMinimum']
			});
		}
	});
