import { error, fail } from '@sveltejs/kit';
import { User } from '$models/users';
import { dbConnect, dbDisconnect } from '$utils/db';
import { validateData } from '$utils/utils';
import { customerSchema } from './customerSchema';

export const actions = {
	post: async ({ request }) => {
		try {
			await dbConnect();

			const form = await request.formData();
			const { formData, errors } = await validateData(form, customerSchema);

			const body = {
				phone: form.get('phone'),
				name: form.get('name'),
				...(form.get('lastName') && { lastName: form.get('lastName') }),
				...(form.get('maternalSurname') && { maternalSurname: form.get('maternalSurname') }),
				...(form.get('street') !== '' &&
					form.get('number') !== '' && {
						address: {
							street: form.get('street'),
							number: form.get('number'),
							...(form.get('municipality') && { municipality: form.get('municipality') }),
							...(form.get('city') && { city: form.get('city') }),
							...(form.get('state') && { state: form.get('state') }),
							place_id: form.get('place_id')
						}
					}),
				userType: 'CUSTOMER',
				active: true
			};

			if (errors) {
				return fail(401, {
					data: formData,
					errors: errors.fieldErrors
				});
			}

			const findCustomer = await User.findOne({ phone: body.phone }).exec();
			if (findCustomer) {
				return fail(400, { message: 'El número ya existe' });
			}

			const customer = new User(body);
			await customer.save();

			return { success: true };
		} catch (err) {
			console.log('Error: ', err);
			error(500, err);
		} finally {
			await dbDisconnect();
		}
	}
};
