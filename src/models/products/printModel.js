import { BaseProduct } from './baseProductModel';

export const Print = BaseProduct.discriminator(
	'Print',
	new Schema({
		pageSize: {
			type: String,
			enum: ['letter', 'legal', 'ledger', 'tabloide'],
			required: true
		},
		color: {
			type: String,
			enum: ['color', 'b&w'],
			required: true
		},
		paperType: {
			type: String,
			required: true
		}
	})
);
