import { error, fail } from '@sveltejs/kit';
import { Product } from '$models/products';
import { Category } from '$models/categories';
import { dbConnect, dbDisconnect } from '$utils/db';
import { validateData } from '$utils/utils';
import { productSchema } from './editProductValidationSchema';
import { uploadImageToFirestorage } from '../../../services/firebase';

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
		error(500, err);
	} finally {
		await dbDisconnect();
	}
}

export const actions = {
	update: async ({ request }) => {
		let productError;
		try {
			await dbConnect();

			const form = await request.formData();
			const { formData, errors } = await validateData(form, productSchema);

			const imageFile = form.get('image');

			let url;
			if (imageFile) {
				url = await uploadImageToFirestorage(imageFile);
			}

			const findCategory = Category.findOne({ name: formData.category });
			if (!findCategory) {
				return fail(400, { message: 'La categoria no existe' });
			}

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
					form.get('requiredStock') && {
						stock: {
							stock: form.get('stock'),
							stockMinimum: form.get('stockMinimum')
						}
					}),
				...(url && { productImageName: url }),
				$unset: {
					...(form.get('model') === '' && { model: 1 }),
					...(form.get('brand') === '' && { brand: 1 }),
					...(form.get('wholesale') === '' && { wholesale: 1 }),
					...(form.get('requiredStock') !== 'on' && { stock: 1 })
				}
			};

			if (errors) {
				return fail(401, {
					data: formData,
					errors: errors.fieldErrors
				});
			}

			Product.findByIdAndUpdate(form.get('id'), body, function (err) {
				if (err) {
					productError = err;
				}
			});
		} catch (err) {
			console.log('Error: ', err);
			error(500, err);
		} finally {
			await dbDisconnect();
		}

		if (productError) error(500, { message: 'Error en la base de datos' });

		return { success: true };
	}
};
