import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	try {
		return { user: JSON.parse(JSON.stringify(locals.user)) };
	} catch (err) {
		console.log('Error:', err);
		throw error(500, err);
	}
};
