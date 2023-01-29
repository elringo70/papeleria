import { z } from 'zod';

export const customerSchema = z
	.object({
		phone: z
			.string()
			.length(10, { message: 'Debe de ser de 10 dígitos' })
			.superRefine((val, ctx) => {
				const parsed = parseInt(val, 10);

				if (!(isNaN(parsed) || isFinite(val))) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Solo números'
					});

					return z.NEVER;
				}

				return parsed;
			}),

		name: z
			.string({ required_error: 'Campo requerido', message: 'Nombre invalido' })
			.min(3, { message: 'Nombre muy corto' })
			.max(64, { message: 'Nombre muy largo' }),

		lastName: z
			.string({ message: 'Nombre invalido' })
			.min(3, { message: 'Nombre muy corto' })
			.max(64, { message: 'Nombre muy largo' })
			.or(z.literal('')),

		maternalSurname: z
			.string({ message: 'Nombre invalido' })
			.min(3, { message: 'Nombre muy corto' })
			.max(64, { message: 'Nombre muy largo' })
			.or(z.literal('')),

		requiredAddress: z.nativeEnum(['on']).nullish(),

		street: z.optional(z.string()),
		number: z.optional(z.string()),
		municipality: z.optional(z.string()),
		city: z.optional(z.string()),
		state: z.optional(z.string())
	})

	.superRefine((val, ctx) => {
		if (val.requiredAddress === 'on') {
			if (val.street === '') {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Campo requerido',
					path: ['street']
				});
			}

			if (val.number === '') {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Campo requerido',
					path: ['number']
				});
			}
		}
	});
