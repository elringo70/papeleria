import { error, fail, redirect } from '@sveltejs/kit';
import { Category } from '$models/categories';
import { Product } from '$models/products';
import { dbConnect, dbDisconnect } from '$utils/db';
import { validateData } from '$utils/utils';
import { productSchema } from './productValidationSchema';

export const load = async () => {
	try {
		await dbConnect();
		const categories = await Category.find().sort({ name: 'asc' });

		if (categories.length === 0) {
			throw redirect(303, '/categories');
		}

		return { categories: JSON.parse(JSON.stringify(categories)) };
	} catch (err) {
		console.log('Error: ', err);
		throw error(500, err);
	} finally {
		await dbDisconnect();
	}
};

export const actions = {
	submit: async ({ request }) => {
		try {
			await dbConnect();

			const form = await request.formData();
			const { formData, errors } = await validateData(form, productSchema);

			const body = {
				_id: form.get('_id'),
				product: form.get('product'),
				...(form.get('model') && { model: form.get('model') }),
				...(form.get('brand') && { brand: form.get('brand') }),
				category: form.get('category'),
				cost: form.get('cost'),
				price: form.get('price'),
				...(form.get('wholesale') && { wholesale: form.get('wholesale') }),
				requiredStock: form.get('requiredStock') === 'on' ? true : false,
				...((form.get('stock') !== '' || form.get('stockMinimum')) !== '' &&
					form.get('requiredStock') === 'on' && {
						stock: {
							stock: form.get('stock'),
							stockMinimum: form.get('stockMinimum')
						}
					})
			};

			if (errors) {
				return fail(401, {
					data: formData,
					errors: errors.fieldErrors
				});
			}

			const findCategory = await Category.findById(body.category);
			if (!findCategory) {
				return fail(400, { message: 'La categoría no existe' });
			}

			const findProduct = await Product.findById(body._id);
			if (findProduct) {
				return fail(400, { message: 'El código ya existe' });
			}

			const product = new Product(formData);
			await product.save();

			return { success: true };
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, err);
		} finally {
			await dbDisconnect();
		}
	}
};
