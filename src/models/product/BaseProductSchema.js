import { Schema, model, models } from 'mongoose';

const baseOptions = {
	discriminatorKey: 'product',
	collection: 'products',
	timestamps: true,
	_id: false
};

const baseProductSchema = new Schema(
	{
		_id: {
			type: String,
			trim: true,
			required: true,
			uppercase: true
		},
		product: {
			type: String,
			required: true,
			trim: true,
			uppercase: true
		},
		model: {
			type: String,
			trim: true,
			uppercase: true
		},
		brand: {
			type: String,
			trim: true,
			uppercase: true
		},
		category: {
			type: String,
			required: true
		},
		cost: {
			type: Number,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		wholesale: Number,
		requiredStock: {
			type: Boolean,
			required: true,
			default: true
		},
		productImageName: { type: String }
	},
	baseOptions
);

export const BaseProduct = models.baseProductSchema ?? model('BaseProduct', baseProductSchema);
