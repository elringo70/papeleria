<script>
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';

	import { Alert, Modal, Input, Button } from '$lib/components';

	import Icon from '@iconify/svelte';

	import { firstUppercase } from '$utils/stringUtils';

	export let data;
	export let form;
	let errors;
	$: errors;

	let confirm = false;
	let loading = false;

	const alertObject = {
		type: '',
		message: ''
	};

	const submitCategory = ({ form, data, action, cancel }) => {
		loading = true;
		return async ({ result, update }) => {
			errors = result.data.errors;

			switch (result.type) {
				case 'success':
					confirm = true;
					alertObject.type = result.type;
					alertObject.message = result.data.message;

					setTimeout(() => {
						confirm = false;
					}, 2000);

					await update();
					break;
				case 'failure':
					if (result.status === 400) {
						confirm = true;
						alertObject.type = result.type;
						alertObject.message = result.data.message;

						setTimeout(() => {
							confirm = false;
						}, 2000);
					}
					break;
			}

			loading = false;
		};
	};

	const deleteCategory = ({ form, data, action, cancel }) => {
		modalObject.open = false;
		return async ({ result, update }) => {
			switch (result) {
				case 'success':
					break;
				case 'failure':
					break;
			}
			await update();
		};
	};

	const modalObject = {
		open: false,
		title: '',
		content: '',
		id: ''
	};

	const showModal = (id) => {
		modalObject.open = !modalObject.open;
		modalObject.title = '¿Desea eliminar la categoría?';
		modalObject.content = 'Una vez eliminado, los cambios no se pueden revertir.';
		modalObject.id = id;
	};
</script>

<svelte:head>
	<title>Categorias</title>
</svelte:head>

<div class="container w-9/12 mx-auto mt-5">
	<div class="flex flex-row space-x-10">
		<div class="basis-6/12 bg-white">
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
						class="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow shadow-indigo-700"
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
		<div class="basis-6/12">
			{#if data.categories.length === 0}
				<h1>Aun no hay categorías</h1>
			{:else}
				<ul class="border rounded border-gray-300 divide-y divide-gray-300 text-gray-900">
					{#each data.categories as category}
						<li
							class="py-2 px-4 w-full flex flex-row justify-between items-center hover:bg-gray-200"
						>
							<div>
								{firstUppercase(category.name)}
							</div>

							<div class="flex flex-row shadow-md">
								<form action="?/edit" method="POST">
									<input type="hidden" name="id" value={category._id} />
									<button
										type="submit"
										class="bg-gray-400 hover:bg-gray-500 text-white font-bold p-2.5 text-xl rounded-l"
										><Icon icon="material-symbols:edit" /></button
									>
								</form>

								<button
									on:click={showModal(category._id)}
									class="bg-red-500 hover:bg-red-600 text-white font-bold p-2.5 text-xl rounded-r"
									><Icon icon="material-symbols:cancel" /></button
								>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>

<Modal title={modalObject.title} content={modalObject.content} open={modalObject.open}>
	<div slot="action" class="flex flex-row space-x-3 justify-end">
		<button
			on:click={showModal}
			class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow shadow-red-700"
			>Cancelar</button
		>
		<form action="?/delete" method="POST" use:enhance={deleteCategory}>
			<input type="hidden" name="id" value={modalObject.id} />
			<button
				type="submit"
				class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow shadow-blue-700"
				>Eliminar</button
			>
		</form>
	</div>
</Modal>
