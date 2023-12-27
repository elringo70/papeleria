<script>
	import { getContext, onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { beforeNavigate } from '$app/navigation';
	import Swal from 'sweetalert2';
	import Icon from '@iconify/svelte';

	import { searchProductStore, selectedProduct } from '../stores/searchProductStore';

	import { Input } from '$lib/components';

	let searchProductModal;
	let inputProduct;
	let form;
	let timer;

	const tickets = getContext('tickets');
	const focusInputElement = getContext('focusInputElement');

	const handleSubmit = ({ formData, cancel }) => {
		const { product } = Object.fromEntries(formData);

		if (!product) cancel();
		return async ({ result }) => {
			const { type, data } = result;
			switch (type) {
				case 'success':
					fillTable(data.products);
					break;
			}
		};
	};

	const holdOnInput = (event) => {
		clearTimeout(timer);

		timer = setTimeout(async () => {
			if (event.target.value !== '') return form.requestSubmit();

			resetTable();
		}, 500);
	};

	const handleOnClickProduct = (index) => {
		searchProductStore.selectProduct(index);
	};

	const fillTable = (products) => {
		searchProductStore.setProducts(products);
	};

	const resetTable = () => {
		inputProduct.value = '';
		searchProductStore.reset();
	};

	const selectProduct = (product) => {
		if (product.requiredStock && product.hasOwnProperty('stock')) {
			if (product.stock.stock === 0) {
				closeModal();

				setTimeout(() => {
					Swal.fire({
						title: 'Sin existencia',
						icon: 'error'
					});
				}, 100);
			} else {
				tickets.addProductToTicket(product);
				resetTable();
				searchProductModal.close();
			}
		} else {
			tickets.addProductToTicket(product);
			resetTable();
			searchProductModal.close();
		}
	};

	const closeModal = () => {
		searchProductModal.close();
		resetTable();
	};

	onMount(() => {
		searchProductModal = document.getElementById('searchProductModal');

		addEventListener('keydown', function (event) {
			switch (event.key) {
				case 'Escape':
					resetTable();
					break;
			}
		});
	});

	beforeNavigate(() => {
		resetTable();
	});
</script>

<dialog id="searchProductModal" class="modal">
	<div class="modal-box w-5/6 max-w-none rounded-none bg-white">
		<h1 class="text-center text-3xl text-gray-700">Buscar producto</h1>
		<form
			bind:this={form}
			action="?/searchProduct"
			method="post"
			use:enhance={handleSubmit}
			autocomplete="off"
		>
			<div class="flex items-start gap-5">
				<Input
					name="product"
					placeholder="Producto"
					bind:bindElement={inputProduct}
					onKeyup={holdOnInput}
				/>
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
					class=" rounded bg-gray-400 px-3 py-2 text-white shadow shadow-gray-400 hover:bg-gray-500"
					on:click={closeModal}>Cerrar</button
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
							<th class="p-3">Edición</th>
						</tr>
					</thead>
					<tbody class="text-xs text-gray-700">
						{#each $searchProductStore as product, index}
							{#if product?.stock?.stock > 0}
								<tr
									class={$selectedProduct === index
										? 'cursor-default select-none border-b bg-blue-500 text-white hover:bg-blue-600'
										: 'cursor-default select-none border-b bg-white py-1'}
									on:click={() => handleOnClickProduct(index)}
									on:dblclick={() => selectProduct(product)}
								>
									<td class="px-3 py-2">{product.product}</td>
									<td class="px-3 py-2">{product.category}</td>
									<td class="px-3 py-2">$ {product.price}</td>
									<td class="px-3 py-2">{product?.stock?.stock}</td>
									<td class="px-3 py-2">$ {product.wholesale}</td>
									<td class="flex h-full w-full items-center justify-center px-3 py-2"
										><a href="/products/{product._id}"><Icon icon="tabler:edit" /></a></td
									>
								</tr>
							{:else}
								<tr class="cursor-default select-none border-b bg-gray-100 py-1 text-gray-400">
									<td class="px-3 py-2">{product.product}</td>
									<td class="px-3 py-2">{product.category}</td>
									<td class="px-3 py-2">$ {product.price}</td>
									<td class="px-3 py-2">{product?.stock?.stock}</td>
									<td class="px-3 py-2">$ {product.wholesale}</td>
									<td class="flex h-full w-full justify-center px-3 py-2 align-middle"
										><a href="/products/{product._id}"><Icon icon="tabler:edit" /></a></td
									>
								</tr>
							{/if}
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</div>
</dialog>
