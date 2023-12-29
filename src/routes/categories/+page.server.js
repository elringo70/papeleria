import { error, fail } from '@sveltejs/kit';
import { Category } from '$models/categories';
import { dbConnect, dbDisconnect } from '$utils/db';
import { z } from 'zod';
import { validateData } from '$utils/utils';

const categorySchema = z.object({
	name: z
		.string({ required_error: 'Ingrese un nombre de categoría' })
		.min(3, { message: 'Ingrese un nombre de categoría' })
		.max(64, { message: 'Nombre demasiado largo' })
		.trim(),
	active: z.boolean().optional()
});

export const load = async () => {
	try {
		await dbConnect();
		const categories = await Category.find().sort({ name: 'asc' });
		return { categories: JSON.parse(JSON.stringify(categories)) };
	} catch (err) {
		console.log('Error: ', err);
		error(500, err);
	} finally {
		await dbDisconnect();
	}
};

export const actions = {
	post: async ({ request }) => {
		try {
			await dbConnect();

			const { formData, errors } = await validateData(await request.formData(), categorySchema);

			if (errors) {
				return fail(401, {
					data: formData,
					errors: errors.fieldErrors
				});
			}

			const findCategory = await Category.findOne({ name: formData.name });
			if (findCategory) {
				return fail(400, { message: 'La categoría ya existe' });
			}

			const category = new Category(formData);
			await category.save();
			return { success: true, message: 'Categoría creada' };
		} catch (err) {
			console.log('Error: ', err);
			error(500, err);
		} finally {
			await dbDisconnect();
		}
	},

	delete: async ({ request }) => {
		try {
			await dbConnect();
			const { id } = Object.fromEntries(await request.formData());

			const findCategory = await Category.findById(id);
			if (!findCategory) {
				return fail(400, { message: 'La categoría no existe' });
			}

			await Category.findByIdAndRemove(id);

			return { success: true };
		} catch (err) {
			console.log('Error: ', err);
			error(500, err);
		} finally {
			await dbDisconnect();
		}
	}
};
