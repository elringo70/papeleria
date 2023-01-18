import { error, fail } from '@sveltejs/kit';
import { Product } from '$models/products';
import { dbConnect, dbDisconnect } from '$utils/db';
import { validateData } from '$utils/utils';

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

			const form = await request.formData();
			//const { formData, errors } = await validateData(form, productSchema);

			const id = form.get('id');
			console.log(id);

			/* const findProduct = await Product.findById(form.get('id'));
			if (!findProduct) {
				return fail(400, { message: 'El producto no existe' });
			} */

			const findProduct = await Product.findOneAndRemove({ _id: id });
			if (findProduct) {
				return { success: true };
			} else {
				return fail(400, { message: 'Producto no encontrado' });
			}

			return { success: true };
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, err);
		} finally {
			await dbDisconnect();
		}
	}
};
