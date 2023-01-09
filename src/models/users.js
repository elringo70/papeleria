import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
	{
		phone: {
			type: String,
			unique: true,
			trim: true,
			index: true,
			min: 10,
			max: 10
		},
		name: {
			type: String,
			required: true,
			uppercase: true,
			trim: true
		},
		lastName: {
			type: String,
			uppercase: true,
			trim: true
		},
		maternalSurname: {
			type: String,
			uppercase: true,
			trim: true
		},
		address: {
			type: new Schema(
				{
					street: {
						type: String,
						required: true,
						uppercase: true,
						trim: true
					},
					number: {
						type: String,
						required: true,
						uppercase: true,
						trim: true
					},
					municipality: {
						type: String,
						uppercase: true,
						trim: true
					},
					city: {
						type: String,
						uppercase: true,
						trim: true
					},
					state: {
						type: String,
						uppercase: true,
						trim: true
					},
					place_id: {
						type: Number,
						required: true
					}
				},
				{ _id: false }
			),
			required: false
		},
		userType: {
			type: String,
			required: true,
			uppercase: true,
			trim: true
		},
		active: {
			type: Boolean,
			required: true
		}
	},
	{
		timestamps: true
	}
);

export const User = models.User ?? model('User', userSchema);
