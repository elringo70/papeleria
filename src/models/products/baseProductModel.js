import { Schema, model, models } from 'mongoose';

export const baseProductSchema = new Schema(
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
		category: {
			type: String,
			required: true
		},
		subCategory: {
			type: String
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
			default: false
		},
		productImageName: String
	},
	{ _id: false, timestamps: true }
);

export const BaseProduct = models.BaseProduct ?? model('BaseProduct', baseProductSchema);
