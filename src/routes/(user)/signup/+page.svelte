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
	<div class="container mx-auto w-3/6 rounded bg-white p-5 shadow-lg">
		<form action="?/submit" method="post" use:enhance={handleSubmit} autocomplete="off">
			<div class="flex w-full flex-col justify-center">
				<h3 class="text-center text-2xl font-semibold text-gray-800">Registrarse</h3>
				<p class="text-center text-gray-400">Ingrese su información</p>
			</div>
			<div class="container mx-auto mt-6 w-4/6">
				<div class="flex flex-col">
					<div class="basis-full">
						<Input
							label="Email *"
							name="phone"
							required={true}
							maxlength={10}
							value={form?.data?.phone ?? ''}
							errors={errors?.phone}
						/>
					</div>
				</div>
				<div class="flex flex-row space-x-4">
					<div class="basis-1/2">
						<Input
							label="Contraseña *"
							name="phone"
							required={true}
							maxlength={10}
							value={form?.data?.phone ?? ''}
							errors={errors?.phone}
						/>
					</div>
					<div class="basis-1/2">
						<Input
							label="Confirmar contraseña *"
							name="phone"
							required={true}
							maxlength={10}
							value={form?.data?.phone ?? ''}
							errors={errors?.phone}
						/>
					</div>
				</div>

				<div class="mt-6 basis-full">
					<button
						class="mx-auto w-full rounded bg-indigo-600 py-2 px-3 text-white hover:bg-indigo-500"
						type="submit">Registrarse</button
					>
				</div>
			</div>
		</form>
	</div>
</section>
