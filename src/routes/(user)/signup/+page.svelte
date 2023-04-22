<script>
	import { enhance } from '$app/forms';

	import { Input } from '$lib/components';

	/** @type {import('./$types').ActionData} */
	export let form;
	let errors;
	$: errors;

	const handleSubmit = () => {
		return async ({ result, update }) => {
			errors = result?.data?.errors;

			switch (result.type) {
				case 'success':
					console.log(first);
					await update();
					break;
				case 'failure':
					break;
				case 'error':
					break;
			}
		};
	};
</script>

<section class="flex h-[calc(100vh-66px)] items-center justify-center bg-gray-100">
	<div class="container mx-auto flex max-w-sm flex-1 flex-col items-center justify-center px-2">
		<div class="w-full rounded bg-white px-6 py-8 text-black shadow-md">
			<h1 class="mb-8 text-center text-3xl">Registrarse</h1>

			<Input placeholder="Nombre completo" name="name" />
			<Input placeholder="Correo electrónico" name="email" type="email" />
			<Input placeholder="Contraseña" name="password" type="password" />
			<Input placeholder="Confirmar contraseña" name="confirm-password" type="password" />

			<button
				type="submit"
				class="w-full rounded bg-indigo-600 py-2 px-3 text-white hover:bg-indigo-500"
				>Crear cuenta</button
			>

			<div class="text-grey-dark mt-4 text-center text-sm">
				Al registrarse, usted acepta los
				<a class="border-grey-dark text-grey-dark border-b no-underline" href="/terms">
					Terminos y condiciones
				</a>
			</div>
		</div>

		<div class="text-grey-dark mt-6">
			¿Ya tiene cuenta?
			<a class="border-blue text-blue border-b no-underline" href="/login"> Log in </a>.
		</div>
	</div>
</section>
