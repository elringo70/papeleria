import { error, fail } from '@sveltejs/kit';
import { Product } from '$models/products';
import { dbConnect, dbDisconnect } from '$utils/db';

export const load = async () => {
	try {
		await dbConnect();
		const products = await Product.find().populate('category');
		return { products: JSON.parse(JSON.stringify(products)) };
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

			const findProduct = await Product.findOneAndRemove({ _id: id });
			if (findProduct) {
				return { success: true };
			} else {
				return fail(400, { message: 'Producto no encontrado' });
			}
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, err);
		} finally {
			await dbDisconnect();
		}
	}
};
