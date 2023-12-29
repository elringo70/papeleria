import { error, fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {

    try {
      const { email, password } = Object.fromEntries(await request.formData())

      console.log(email, password)

      return { success: true }
    } catch (err) {
      console.log(err)
      error(500, err);
    } finally {

    }
  }
};
