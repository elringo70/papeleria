import { error, json } from '@sveltejs/kit';
import { dbConnect, dbDisconnect } from '$utils/db';
import { Order } from '$models/orders';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		await dbConnect();

		var start = new Date();
		start.setUTCHours(0, 0, 0, 0);

		var end = new Date();
		end.setUTCHours(23, 59, 59, 999);

		const dailyOrders = await Order.find({
			createdAt: { $gte: start, $lte: end }
		});

		return json(dailyOrders);
	} catch (err) {
		console.log(err);
		throw new error(err);
	} finally {
		await dbDisconnect();
	}
}
