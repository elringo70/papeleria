import { error, json } from '@sveltejs/kit';
import { dbConnect, dbDisconnect } from '$utils/db';
import { Order } from '$models/orders';
import moment from 'moment';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		await dbConnect();

		const start = moment().startOf('day').toDate();
		const end = moment().startOf('day').add(1, 'day').toDate();

		const dailyOrders = await Order.find({
			createdAt: { $gte: start, $lte: end }
		})
			.sort({ date: -1 })
			.exec();

		return json(dailyOrders);
	} catch (err) {
		console.log(err);
		throw new error(err);
	} finally {
		await dbDisconnect();
	}
}
