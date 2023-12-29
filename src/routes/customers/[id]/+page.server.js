import { error, fail } from '@sveltejs/kit';
import { User } from '$models/users';
import { dbConnect, dbDisconnect } from '$utils/db';
import { validateData } from '$utils/utils';
import { customerSchema } from '../new-customer/customerSchema';
import { custom } from 'zod';

export async function load({ params }) {
	try {
		await dbConnect();

		const findCustomer = await User.findById(params.id);
		if (!findCustomer) return fail(404, { message: 'Cliente no encontrado' });

		return { customer: JSON.parse(JSON.stringify(findCustomer)) };
	} catch (err) {
		console.log('Error: ', err);
		error(500, err);
	} finally {
		await dbDisconnect();
	}
}

export const actions = {
	submit: async ({ request }) => {
		let customerError = null;
		try {
			await dbConnect();

			const form = await request.formData();
			const { formData, errors } = await validateData(form, customerSchema);

			const body = {
				name: form.get('name'),
				...(form.get('lastName') !== '' && { lastName: form.get('lastName') }),
				...(form.get('maternalSurname') !== '' && { maternalSurname: form.get('maternalSurname') }),
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
				$unset: {
					...(form.get('lastName') === '' && { lastName: 1 }),
					...(form.get('maternalSurname') === '' && { maternalSurname: 1 }),
					...(form.get('requiredAddress') !== 'on' && { address: 1 })
				}
			};

			if (errors) {
				return fail(401, {
					data: formData,
					errors: errors.fieldErrors
				});
			}

			const findCustomer = await User.findOne({ phone: form.get('phone') }).exec();

			if (!findCustomer) {
				return fail(400, { message: 'El número no existe' });
			}

			User.findByIdAndUpdate(form.get('id'), body, function (err) {
				if (err) customerError = err;
			});
		} catch (err) {
			console.log('Error: ', err);
			error(500, err);
		} finally {
			await dbDisconnect();
		}

		if (customerError) error(500, { message: 'Error en la base de datos' });
		return { success: true };
	}
};
