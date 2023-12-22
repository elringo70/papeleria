import { Schema, model, models } from 'mongoose';

const orderSchema = new Schema(
	{
		customer: Schema.Types.Mixed,
		products: { type: [], required: true },
		status: { type: Boolean, required: true },
		delivered: { type: Boolean, required: true },
		change: { type: Number, required: true },
		customerPayment: { type: Number, required: true },
		paymentCreditDebit: { type: Number, required: true },
		paymentETransfer: { type: Number, required: true },
		total: { type: Number, required: true },
		orderStatus: {
			type: String,
			enum: ['completed', 'cancelled'],
			required: true,
			default: 'completed'
		}
	},
	{
		timestamps: true
	}
);

export const Order = models.Order ?? model('Order', orderSchema);
