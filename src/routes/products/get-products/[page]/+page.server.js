import { error, fail, json } from '@sveltejs/kit';
import { Product } from '$models/products';
import { dbConnect, dbDisconnect } from '$utils/db';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, url }) => {
	let sortBy = { name: 'asc' };
	let order = url.searchParams.get('order') || 'asc';

	order = order === 'asc' || order === 'desc' ? order : 'asc';

	switch (url.searchParams.get('sortBy')) {
		case 'cost':
			sortBy = {};
			sortBy = { cost: order };
			break;
		case 'product':
			sortBy = {};
			sortBy = { product: order };
			break;
	}

	const page = Number(params.page);
	const limit = 15;
	try {
		await dbConnect();
		const count = await Product.find().count();

		const products = await Product.find()
			.limit(limit)
			.skip(page * limit)
			.sort(sortBy);

		return {
			products: JSON.parse(JSON.stringify(products)),
			pagination: JSON.parse(
				JSON.stringify({
					count,
					limit
				})
			)
		};
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
	},
	getProductById: async ({ request }) => {
		try {
			await dbConnect();

			const { id } = Object.fromEntries(await request.formData());

			const product = await Product.findById(id).exec();

			if (product) {
				return JSON.parse(JSON.stringify(product));
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
