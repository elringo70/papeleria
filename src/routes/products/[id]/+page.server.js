import { error, fail } from '@sveltejs/kit';
import { Product } from '$models/products';
import { Category } from '$models/categories';
import { dbConnect, dbDisconnect } from '$utils/db';
import { validateData } from '$utils/utils';
import { productSchema } from './editProductValidationSchema';

export async function load({ params }) {
	try {
		await dbConnect();

		const categories = await Category.find().sort({ name: 'asc' });

		const findProduct = await Product.findById(params.id);
		if (!findProduct) return fail(404, { message: 'Producto no encontrado' });

		return {
			categories: JSON.parse(JSON.stringify(categories)),
			product: JSON.parse(JSON.stringify(findProduct))
		};
	} catch (err) {
		console.log('Error: ', err);
		throw error(500, err);
	} finally {
		await dbDisconnect();
	}
}
