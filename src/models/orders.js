import { Schema, model, models } from 'mongoose';
import { productSchema } from '$models/products';
import { userSchema } from '$models/users';

const orderSchema = new Schema(
	{
		customer: Schema.Types.Mixed,
		products: { type: [], required: true },
		status: { type: Boolean, required: true },
		delivered: { type: Boolean, required: true },
		change: { type: Number, required: true },
		customerPayment: { type: Number, required: true },
		paymentCreditDebit: { type: Number, required: true },
		paymentETransfer: { type: Number, required: true }
	},
	{
		timestamps: true
	}
);

export const Order = models.Order ?? model('Order', orderSchema);
