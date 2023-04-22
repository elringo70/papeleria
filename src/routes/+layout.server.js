/** @type {import('./$types').PageServerLoad} */
export const load = async ({ session }) => {
	console.log(session);
};
