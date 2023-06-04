/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies }) {
	cookies.set('session', '', {
		path: '/',
		httpOnly: true,
		maxAge: 0
	});
	return new Response(null, { status: 200 });
}
