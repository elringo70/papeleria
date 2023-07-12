<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { Input } from '$lib/components';

	export let productSearch;
	export let products = [];
	export let showSearchModal = false;

	const closeSearchModal = () => {
		showSearchModal = false;
		products = [];
	};

	let inputElement;

	$: if (showSearchModal) {
		if (inputElement) {
			setTimeout(() => {
				inputElement.focus();
			}, 100);
		}
	}
	const dispatch = createEventDispatcher();
</script>

{#if showSearchModal}
	<div
		class="modal-bg flex flex-col rounded-md bg-white px-7 pb-7 pt-3 shadow-lg"
		transition:fade
		aria-hidden="true"
		tabindex="-1"
	>
		<div class="modal rounded" transition:fade tabindex="-1">
			<div class="mb-2 flex justify-end">
				<div class="text-2xl text-gray-600">
					<button type="button" on:click={closeSearchModal}
						><Icon icon="material-symbols:close" /></button
					>
				</div>
			</div>
			<div class="w-full" tabindex="-1">
				<form
					action="?/searchProduct"
					method="post"
					autocomplete="off"
					use:enhance={productSearch}
					tabindex="-1"
				>
					<div class="flex gap-x-5">
						<div class="basis-2/3">
							<Input name="productName" bind:bindElement={inputElement} />
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

			<div class="max-h-96 overflow-auto" tabindex="-1">
				<table class="w-full min-w-max table-auto" tabindex="-1">
					<thead tabindex="-1">
						<tr class="bg-gray-200 text-sm uppercase leading-normal text-gray-600">
							<th class="px-6 py-3 text-left">Producto</th>
							<th class="px-6 py-3 text-left">Marca</th>
							<th class="px-6 py-3 text-left">Categoría</th>
							<th class="px-6 py-3 text-center">Precio</th>
							<th class="px-6 py-3 text-center">Mayoreo</th>
							<th class="px-6 py-3 text-center">Cantidad</th>
						</tr>
					</thead>
					<tbody class="text-sm font-light text-gray-600" tabindex="-1">
						{#each products as product}
							<tr
								class="border-b border-gray-200 bg-gray-50 {product.requiredStock &&
								product.stock.stock === 0
									? 'bg-red-100 text-red-500'
									: 'hover:bg-gray-100'}"
								on:dblclick={() => {
									dispatch('productId', { _id: product._id });
								}}
							>
								<td class="px-5 py-2 text-left">
									<div class="flex items-center">
										<span>{product.product}</span>
									</div>
								</td>
								<td class="px-5 py-2 text-left">
									<div class="flex items-center">
										<span>{product.brand}</span>
									</div>
								</td>
								<td class="px-5 py-2 text-center">
									<div class="flex items-center justify-center">
										{product.category}
									</div>
								</td>

								<td class="px-5 py-2 text-center">$ {Number(product.price).toFixed(2)}</td>
								<td class="px-5 py-2 text-center">$ {Number(product.wholesale).toFixed(2)}</td>
								<td class="px-5 py-2 text-center">{product.stock?.stock ?? 'Sin inventario'}</td>
							</tr>
						{:else}
							<td class="py-3 text-center" colspan="8"> ...Sin productos </td>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-bg {
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal {
		background-color: #fefefe;
		padding: 20px;
		border: 1px solid #888;
		width: 80%;
		animation: modalFadeIn 0.3s;
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	input[type='text'] {
		width: 100%;
		padding: 10px;
		font-size: 16px;
		margin-bottom: 10px;
	}

	@keyframes modalFadeIn {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.modal-bg,
	.modal {
		transition: opacity 0.3s;
	}

	.modal-bg-enter {
		opacity: 0;
	}

	.modal-bg-enter-active {
		opacity: 1;
	}

	.modal-bg-exit {
		opacity: 1;
	}

	.modal-bg-exit-active {
		opacity: 0;
	}
</style>
