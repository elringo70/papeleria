import { error, fail } from '@sveltejs/kit';
import { User } from '$models/users';
import { dbConnect, dbDisconnect } from '$utils/db';

export const load = async () => {
	try {
		await dbConnect();
		const customers = await User.find({});
		console.log(customers);
		return { customers: JSON.parse(JSON.stringify(customers)) };
	} catch (err) {
		console.log('Error: ', err);
		throw error(500, err);
	} finally {
		await dbDisconnect();
	}
};

export const actions = {
	delete: async ({ request }) => {
		try {
			await dbConnect();
			const { id } = Object.fromEntries(await request.formData());

			const findCustomer = await User.findById(id).exec();
			if (!findCustomer) {
				return fail(404, { message: 'El cliente no existe' });
			}

			await User.findByIdAndRemove(id);

			return { success: true };
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, err);
		} finally {
			await dbDisconnect();
		}
	}
};
