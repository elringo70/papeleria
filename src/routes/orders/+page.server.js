import { error, fail } from '@sveltejs/kit';
import { Product } from '$models/products';
import { User } from '$models/users';
import { dbConnect, dbDisconnect } from '$utils/db';
import { redis } from '$lib/server/redis';

export const actions = {
	findProduct: async ({ request }) => {
		try {
			await dbConnect();

			const { product } = Object.fromEntries(await request.formData());

			const cachedProduct = await redis.get(product);
			if (cachedProduct) return { product: JSON.parse(cachedProduct) };

			const findProduct = await Product.findById(product);
			if (findProduct) {
				redis.set(product, JSON.stringify(findProduct), 'EX', 600);
				return { product: JSON.parse(JSON.stringify(findProduct)) };
			}
			return fail(404, { message: 'Producto no encontrado' });
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, err);
		} finally {
			await dbDisconnect();
		}
	},
	findCustomer: async ({ request }) => {
		try {
			await dbConnect();

			const { phone } = Object.fromEntries(await request.formData());
			const findCustomer = await User.findOne({ phone: phone });

			console.log(findCustomer);

			return { success: true };
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, err);
		} finally {
			await dbDisconnect();
		}
	}
};
