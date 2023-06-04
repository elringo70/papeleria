import { Schema, model, models } from 'mongoose';

const baseOptions = {
	discriminatorKey: 'productKey',
	collection: 'products'
};

const baseProductSchema = model(
	'ProductBase',
	new Schema(
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
			productImageName: { type: String }
		},
		{ _id: false, timestamps: true },
		baseOptions
	)
);

export const ProductBase = models.ProductBase ?? model('ProductBase', baseProductSchema);
