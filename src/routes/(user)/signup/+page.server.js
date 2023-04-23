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
	}
};
