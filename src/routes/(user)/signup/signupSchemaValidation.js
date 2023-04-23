import { z } from 'zod';

export const signupSchema = z
	.object({
		email: z
			.string({ required_error: 'Campo requerido' })
			.min(1, { message: 'Demasiado corto' })
			.max(49, { message: 'Demasiado largo' })
			.trim(),
		password: z
			.string({ required_error: 'Campo requerido' })
			.min(6, { message: '6 carácteres al menos' })
			.max(40, { message: 'Contraseña muy larga' })
			.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
				message: 'Contraseña invalida'
			})
			.trim(),
		confirmPassword: z.string({ required_error: 'Campo requerido' }).trim()
	})

	.superRefine((val, ctx) => {
		if (val.password !== val.confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Las contraseñas no coincided',
				path: ['confirmPassword']
			});
		}
	});
