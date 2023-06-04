import { redirect, fail } from '@sveltejs/kit';
import { validateData } from '../../../utils/zodValidation';
import { signupSchema } from './signupSchemaValidation';

const expiresIn = 1000 * 60 * 60 * 27 * 7;

export const actions = {
	createUserWithGoogle: async ({ request }) => {
		const form = await request.formData();
		const { formData, errors } = await validateData(form, signupSchema);

		if (errors) {
			return fail(401, {
				data: formData,
				errors: errors.fieldErrors
			});
		}

		const body = {
			email: formData.get('email'),
			password: formData.get('password')
		};

		return { success: true };
	},
	loginWithGoogle: async ({ request, cookies }) => {
		const body = Object.fromEntries(await request.formData());

		cookies.set('session', body.token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: expiresIn
		});

		throw redirect(303, '/orders');
	}
};
