import { error, fail } from '@sveltejs/kit';
import { Product } from '$models/products';
import { dbConnect, dbDisconnect } from '$utils/db';
import { redis } from '$lib/server/redis';
import { options } from 'prettier-plugin-svelte';

export const POST = async ({ request }) => {
	try {
		await dbConnect();

		const product = await request.json();
		const regProduct = new RegExp(product.normalize('NFC'), 'i');

		const findProduct = await Product.find({
			$or: [
				{ product: regProduct, $options: 'i' },
				{ brand: regProduct, $options: 'i' }
			]
		});

		return new Response(JSON.stringify(findProduct), { status: 200 });
	} catch (err) {
		console.log('Error: ', err);
		throw error(500, err);
	} finally {
		await dbDisconnect();
	}
};
