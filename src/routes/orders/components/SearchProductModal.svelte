<script>
	import { getContext, onMount } from 'svelte';
	import { enhance } from '$app/forms';

	import { searchProductStore } from '../stores/searchProductStore';

	import { Input } from '$lib/components';

	let searchProductModal;
	let inputProduct;
	const tickets = getContext('tickets');

	const handleSubmit = ({ formData, cancel }) => {
		const { product } = Object.fromEntries(formData);

		if (!product) cancel();
		return async ({ result, update }) => {
			const { type, data } = result;
			switch (type) {
				case 'success':
					fillTable(data.products);
					break;
			}
		};
	};

	const fillTable = (products) => {
		searchProductStore.setProducts(products);
	};

	const resetTable = () => {
		inputProduct.value = '';
		searchProductStore.reset();
		inputProduct.focus();
	};

	const selectProduct = (product) => {
		tickets.addProductToTicket(product);
		resetTable();
		searchProductModal.close();
	};

	onMount(() => {
		searchProductModal = document.getElementById('searchProductModal');

		window.addEventListener('keydown', function (event) {
			switch (event.key) {
				case 'Escape':
					resetTable();
					break;
			}
		});
	});
</script>

<dialog id="searchProductModal" class="modal">
	<div class="modal-box w-4/6 max-w-none rounded-none bg-white">
		<h1 class="text-center text-3xl text-gray-700">Buscar producto</h1>
		<form action="?/searchProduct" method="post" use:enhance={handleSubmit} autocomplete="off">
			<div class="flex items-start gap-5">
				<Input name="product" placeholder="Producto" bind:bindElement={inputProduct} />
				<button
					type="submit"
					class=" rounded bg-indigo-500 px-3 py-2 text-white shadow shadow-indigo-500 hover:bg-indigo-600"
					>Buscar</button
				>
				<button
					type="button"
					class=" rounded bg-blue-500 px-3 py-2 text-white shadow shadow-blue-500 hover:bg-blue-600"
					on:click={resetTable}>Limpiar</button
				>
				<button
					type="button"
					class=" rounded bg-red-500 px-3 py-2 text-white shadow shadow-red-500 hover:bg-red-600"
					on:click={searchProductModal.close()}>Cancelar</button
				>
			</div>
		</form>

		<div class="mt-5 overflow-x-auto">
			{#if $searchProductStore.length > 0}
				<table class="w-full text-left text-sm text-gray-500">
					<thead class="bg-gray-50 text-xs uppercase text-gray-800">
						<tr>
							<th class="p-3">Producto</th>
							<th class="p-3">Categoría</th>
							<th class="p-3">Precio</th>
							<th class="p-3">Stock</th>
							<th class="p-3">Mayoreo</th>
						</tr>
					</thead>
					<tbody class="text-xs text-gray-700">
						{#each $searchProductStore as product}
							<tr
								class="cursor-default border-b bg-white py-1 hover:bg-gray-100"
								on:dblclick={() => selectProduct(product)}
							>
								<td class="px-3 py-2">{product.product}</td>
								<td class="px-3 py-2">{product.category}</td>
								<td class="px-3 py-2">$ {product.price}</td>
								<td class="px-3 py-2">{product.stock.stock}</td>
								<td class="px-3 py-2">$ {product.wholesale}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</div>
</dialog>
