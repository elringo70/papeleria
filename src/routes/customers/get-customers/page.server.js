import { error, fail } from '@sveltejs/kit';
import { User } from '$models/users';
import { dbConnect, dbDisconnect } from '$utils/db';

export const load = async () => {
	try {
		await dbConnect();
		const customers = await User.find();
		console.log(customers);
		return { customers: JSON.parse(JSON.stringify(customers)) };
	} catch (err) {
		console.log('Error: ', err);
		throw error(500, err);
	} finally {
		await dbDisconnect();
	}
};
