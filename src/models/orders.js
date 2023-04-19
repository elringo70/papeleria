import { Schema, model, models } from 'mongoose';

const orderSchema = new Schema(
	{
		customer: { type: Object },
		products: []
	},
	{
		timestamps: true
	}
);

export const Order = models.Order ?? model('Order', orderSchema);
