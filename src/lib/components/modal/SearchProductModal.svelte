<script>
	import { createEventDispatcher } from 'svelte';
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { Input } from '$lib/components';

	export let productSearch;
	export let modalOpen = false;
	export let value = '';
	export let products = [];
	export let closeModal;

	const dispatch = createEventDispatcher();
</script>

<div class="modal" class:modal-open={modalOpen}>
	<div class="flex flex-col rounded-md bg-white px-7 pb-7 pt-3 shadow-lg">
		<div class="mb-2 flex justify-end">
			<div class="text-2xl text-gray-600">
				<button type="button" on:click={closeModal}><Icon icon="material-symbols:close" /></button>
			</div>
		</div>
		<div class="w-full">
			<form action="?/searchProduct" method="post" autocomplete="off" use:enhance={productSearch}>
				<div class="flex gap-x-5">
					<div class="basis-2/3">
						<Input name="productName" bind:value />
					</div>
					<div class="basis-1/3">
						<button
							type="submit"
							class="w-full rounded bg-indigo-700 px-4 py-2 text-white shadow shadow-indigo-700 hover:bg-indigo-600"
							>Buscar</button
						>
					</div>
				</div>
			</form>
		</div>

		<div class="max-h-96 overflow-auto">
			<table class="w-full min-w-max table-auto">
				<thead>
					<tr class="bg-gray-200 text-sm uppercase leading-normal text-gray-600">
						<th class="py-3 px-6 text-left">Producto</th>
						<th class="py-3 px-6 text-left">Marca</th>
						<th class="py-3 px-6 text-left">Categoría</th>
						<th class="py-3 px-6 text-center">Precio</th>
						<th class="py-3 px-6 text-center">Mayoreo</th>
						<th class="py-3 px-6 text-center">Cantidad</th>
					</tr>
				</thead>
				<tbody class="text-sm font-light text-gray-600">
					{#each products as product}
						<tr
							class="border-b border-gray-200 bg-gray-50 hover:bg-gray-100"
							on:dblclick={() => {
								dispatch('productId', { _id: product._id });
							}}
						>
							<td class="py-2 px-5 text-left">
								<div class="flex items-center">
									<span class="font-medium">{product.product}</span>
								</div>
							</td>
							<td class="py-2 px-5 text-left">
								<div class="flex items-center">
									<span>{product.brand}</span>
								</div>
							</td>
							<td class="py-2 px-5 text-center">
								<div class="flex items-center justify-center">
									{product.category}
								</div>
							</td>

							<td class="py-2 px-5 text-center">$ {Number(product.price).toFixed(2)}</td>
							<td class="py-2 px-5 text-center">$ {Number(product.wholesale).toFixed(2)}</td>
							<td class="py-2 px-5 text-center">{product.stock?.stock ?? 'Sin inventario'}</td>
						</tr>
					{:else}
						<td class="py-3 text-center" colspan="8"> ...Sin productos </td>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
