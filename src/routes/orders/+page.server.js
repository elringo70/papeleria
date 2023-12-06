import { error, fail } from '@sveltejs/kit';
import { Product } from '$models/products';
import { User } from '$models/users';
import { dbConnect, dbDisconnect } from '$utils/db';
import { redis } from '$lib/server/redis';
import { orderSchema } from './orderValidation.js';
import { validateData } from '$utils/utils';

/** @type {import('./$types').Actions} */
export const actions = {
	findProduct: async ({ request }) => {
		try {
			await dbConnect();

			const form = await request.formData();
			const product = form.get('product');
			const { formData, errors } = await validateData(form, orderSchema);

			if (errors) {
				return fail(401, {
					data: formData,
					errors: errors.fieldErrors
				});
			}

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

			if (findCustomer) return { customer: JSON.parse(JSON.stringify(findCustomer)) };
			return { phone: JSON.parse(JSON.stringify(phone)) };
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, err);
		} finally {
			await dbDisconnect();
		}
	},
	searchProduct: async ({ request }) => {
		try {
			await dbConnect();

			const { product } = Object.fromEntries(await request.formData());

			const findProducts = await Product.find({ product: { $regex: product, $options: 'i' } });

			return { products: JSON.parse(JSON.stringify(findProducts)) };
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, err);
		} finally {
			await dbDisconnect();
		}
	},
	submitOrder: async ({ request }) => {
		try {
			await dbConnect();

			console.log(Object.fromEntries(await request.formData()));

			return { success: true };
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, err);
		} finally {
			await dbDisconnect();
		}
	}
};
