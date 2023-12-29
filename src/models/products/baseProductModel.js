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
			default: true
		},
		stock: {
			type: new Schema({
				stock: {
					type: Number,
					required: true
				},
				stockMinimum: {
					type: Number,
					required: true,
					default: 1
				},
				_id: { id: false }
			}),
			required: false
		},
		productImageName: { type: String }
	},
	{ _id: false, timestamps: true }
);

export const BaseProduct = models.BaseProduct ?? model('BaseProduct', baseProductSchema);
