<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';
	import { fade } from 'svelte/transition';

	import Swal from 'sweetalert2/dist/sweetalert2.all.js';

	import { Alert, Input } from '$lib/components';

	import Icon from '@iconify/svelte';

	import { firstUppercase } from '$utils/stringUtils';

	export let data;
	export let form;
	let errors;
	$: errors;

	let confirm = false;
	let loading = false;
	let timer;

	const alertObject = {
		type: '',
		message: ''
	};

	const submitCategory = () => {
		loading = true;
		return async ({ result, update }) => {
			errors = result.data.errors;

			switch (result.type) {
				case 'success':
					confirm = true;
					alertObject.type = result.type;
					alertObject.message = result.data.message;

					timer = setTimeout(() => {
						confirm = false;
					}, 1500);

					await update();
					break;
				case 'failure':
					if (result.status === 400) {
						confirm = true;
						alertObject.type = result.type;
						alertObject.message = result.data.message;

						timer = setTimeout(() => {
							confirm = false;
						}, 1500);
					}
					break;
			}

			loading = false;
		};
	};

	async function deleteCategory() {
		const confirmationModal = await Swal.fire({
			icon: 'warning',
			title: '¿Desea eliminar el producto?',
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Eliminar'
		});

		if (confirmationModal.isConfirmed) {
			const data = new FormData(this);

			const response = await fetch(this.action, {
				method: 'POST',
				body: data
			});

			const result = deserialize(await response.text());

			switch (result.type) {
				case 'success':
					Swal.fire({
						icon: 'success',
						title: 'Eliminado'
					});

					await invalidateAll();

					break;
				case 'failure':
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: result.data.message
					});
					break;
			}
			applyAction(result);
		}
	}

	if (data.categories.length === 0) {
		Swal.fire({
			icon: 'warning',
			title: 'Sin categorias',
			text: 'Debe ingresar al menos una categoría'
		});
	}

	const beforeUnload = () => {
		clearTimeout(timer);
	};
</script>

<svelte:window on:beforeunload={beforeUnload} />

<svelte:head>
	<title>Categorias</title>
</svelte:head>

<section class="flex h-[calc(100vh-56px)] justify-center bg-gray-100">
	<div class="flex h-full w-full basis-10/12 flex-row items-center space-x-10">
		<div class="basis-1/2 rounded bg-white p-5 shadow-lg">
			<form action="?/post" method="POST" autocomplete="off" use:enhance={submitCategory}>
				<Input
					label="Categoría"
					name="name"
					placeholder="Categoría"
					disabled={loading}
					required={true}
					value={form?.data?.name ?? ''}
					errors={errors?.name}
				/>
				<div class="mt-3">
					<button
						type="submit"
						class="rounded bg-indigo-700 px-4 py-2 text-white shadow shadow-indigo-700 hover:bg-indigo-600"
						disabled={loading}>Agregar</button
					>
				</div>
			</form>
			{#if confirm}
				<div out:fade={{ duration: 1000 }} class="mt-2">
					<Alert {alertObject} />
				</div>
			{/if}
		</div>

		<div class="categories-list basis-1/2 overflow-auto rounded bg-white shadow-lg">
			{#if data.categories.length === 0}
				<h1>Aun no hay categorías</h1>
			{:else}
				<ul class="divide-y divide-gray-300 rounded border border-gray-300 text-gray-900">
					{#each data.categories as category}
						<li
							class="flex w-full flex-row items-center justify-between px-4 py-2 hover:bg-gray-200"
						>
							<div>
								{firstUppercase(category.name)}
							</div>

							<div class="flex flex-row shadow-md">
								<form action="?/edit" method="POST">
									<input type="hidden" name="id" value={category._id} />
									<button
										type="submit"
										class="rounded-l bg-gray-400 p-2.5 text-xl font-bold text-white hover:bg-gray-500"
										><Icon icon="material-symbols:edit" /></button
									>
								</form>

								<form action="?/delete" method="POST" on:submit|preventDefault={deleteCategory}>
									<input type="hidden" name="id" value={category._id} />
									<button
										class="rounded-r bg-red-500 p-2.5 text-xl font-bold text-white hover:bg-red-600"
										><Icon icon="material-symbols:cancel" /></button
									>
								</form>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</section>

<style>
	.categories-list {
		max-height: 85%;
	}
</style>
