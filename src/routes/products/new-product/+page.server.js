import { error, fail, redirect } from '@sveltejs/kit';
import { Category } from '$models/categories';
import { Product } from '$models/products';
import { dbConnect, dbDisconnect } from '$utils/db';
import { validateData } from '$utils/utils';
import { productSchema } from './productValidationSchema';
import { uploadImageToFirestorage } from '../../../services/firebase';

export const load = async () => {
	let categories;
	try {
		await dbConnect();
		categories = await Category.find().sort({ name: 'asc' });
	} catch (err) {
		console.log('Error: ', err);
		error(500, err);
	} finally {
		await dbDisconnect();
	}

	if (categories.length === 0) {
		redirect(303, '/categories');
	}

	return { categories: JSON.parse(JSON.stringify(categories)) };
};

export const actions = {
	submit: async ({ request }) => {
		try {
			await dbConnect();

			const form = await request.formData();
			const { formData, errors } = await validateData(form, productSchema);

			const imageFile = form.get('image');

			let url;
			if (imageFile) {
				url = await uploadImageToFirestorage(imageFile);
			}

			if (errors) {
				return fail(401, {
					data: formData,
					errors: errors.fieldErrors
				});
			}

			const findCategory = await Category.findById(formData.category);
			if (!findCategory) {
				return fail(400, { message: 'La categoría no existe' });
			}

			const findProduct = await Product.findById(form.get('_id'));
			if (findProduct) {
				return fail(400, { message: 'El código ya existe' });
			}

			const body = {
				_id: form.get('_id'),
				product: form.get('product'),
				...(form.get('model') && { model: form.get('model') }),
				...(form.get('brand') && { brand: form.get('brand') }),
				category: findCategory.name,
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
					}),
				...(url && { productImageName: url })
			};

			const product = new Product(body);
			await product.save();
			return { success: true };
		} catch (err) {
			console.log(err);
			error(500, { message: 'Error en el servidor' });
		} finally {
			await dbDisconnect();
		}
	},
	getImageFile: async ({ request }) => {
		try {
			const url = await getImageLinkFromFirestorage();
			console.log(url);
		} catch (error) {
			console.log(error);
		}
	}
};
