import { Product } from '$models/products';
import { dbConnect, dbDisconnect } from '$utils/db';

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ request }) => {
	try {
		await dbConnect();

		const { id } = await request.formData();

		const product = await Product.findById(id);

		if (product) {
			return new Response(JSON.stringify(product), {
				headers: {
					'Content-Type': 'application/json'
				},
				status: 200
			});
		} else {
			return new Response(JSON.stringify({ message: 'Producto no encontrado' }), {
				headers: {
					'Content-Type': 'application/json'
				},
				status: 404
			});
		}
	} catch (error) {
		console.log(error);
		throw new Error('Error en el servidor');
	} finally {
		await dbDisconnect();
	}
};
