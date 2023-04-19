<script>
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components';

	export let form;
	let errors;
	$: errors;
	let loading = false;

	const handleSubmit = () => {
		return async ({ result, update }) => {
			errors = result?.data?.errors;
			switch (result.type) {
				case 'success':
					console.log('success');
					break;
			}
		};
	};
</script>

<section class="flex h-[calc(100vh-66px)] items-center justify-center bg-gray-100">
	<div class="container w-8/12 rounded bg-white p-5 shadow-lg">
		<form action="?/submit" method="post" use:enhance={handleSubmit} enctype="multipart/form-data">
			<div class="flex flex-row space-x-4">
				<div class="basis-4/12">
					<Input
						label="Nombre"
						name="name"
						required={true}
						value={form?.data?.name ?? ''}
						error={errors?.name}
					/>
				</div>
			</div>
			<div class="flex flex-row space-x-4">
				<div class="basis-4/12">
					<button
						type="submit"
						class="w-full rounded bg-indigo-700 px-4 py-2 text-white shadow shadow-indigo-700 hover:bg-indigo-600"
						disabled={loading}>Guardar</button
					>
				</div>
			</div>
		</form>
	</div>
</section>
