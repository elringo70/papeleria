<script>
	import { enhance } from '$app/forms';
	import { getContext, setContext } from 'svelte';
	import { selectedTicket } from '../../../routes/orders/stores/store';
	import Swal from 'sweetalert2';

	import { Input } from '$lib/components';

	const tickets = getContext('tickets');
	const focusInputElement = getContext('focusInputElement');

	export let showSearchModal;
	export let showDailySalesModal;
	export let bindInputElement;

	const addProduct = (dataProduct) => {
		if (dataProduct.requiredStock) {
			if (dataProduct.stock.stock === 0)
				return Swal.fire({
					title: 'Sin existencia',
					icon: 'error'
				});

			const index = $selectedTicket.products.findIndex(
				(product) => product.product._id === dataProduct._id
			);

			if (index !== -1) {
				if ($selectedTicket.products[index].quantity >= dataProduct.stock.stock) {
					Swal.fire({
						title: 'Sin mas existencia',
						icon: 'error'
					});
				} else {
					tickets.addProductToTicket(dataProduct);
				}
			} else {
				tickets.addProductToTicket(dataProduct);
			}
		} else {
			tickets.addProductToTicket(dataProduct);
		}
	};

	async function addProductToTicket({ formElement, cancel }) {
		if (formElement.product.value === '') {
			cancel();
			focusInputElement();
		}

		return async ({ result }) => {
			const { type, data } = result;

			switch (type) {
				case 'success':
					addProduct(data.product);
					formElement.product.value = '';
					focusInputElement();
					break;
				case 'failure':
					Swal.fire({
						icon: 'error',
						title: result.data.message,
						timer: 1250,
						timerProgressBar: true
					});
					break;
			}
		};
	}
</script>

<div class="flex h-full flex-col p-4">
	<form action="?/findProduct" method="post" use:enhance={addProductToTicket} autocomplete="off">
		<div class="flex flex-row items-end justify-between align-bottom">
			<div class="basis-4/6">
				<Input
					label="Código"
					name="product"
					value={''}
					bind:bindElement={bindInputElement}
					tabindex="0"
				/>
			</div>
			<div class="mb-3 basis-1/6">
				<button
					type="submit"
					class="w-full rounded bg-indigo-500 py-2 text-white shadow shadow-indigo-500 hover:bg-indigo-600"
					>Agregar</button
				>
			</div>
		</div>
	</form>

	<div class="flex h-full flex-row items-end justify-around gap-4">
		<button
			type="button"
			class="w-full rounded bg-blue-500 py-2 text-white shadow shadow-blue-500 hover:bg-blue-600"
			on:click={showSearchModal}>Buscar Producto</button
		>

		<button
			type="button"
			class="w-full rounded bg-green-500 py-2 text-white shadow shadow-green-500 hover:bg-green-600"
			>Detalle de Ticket</button
		>

		<button
			type="button"
			class="w-full rounded bg-indigo-500 py-2 text-white shadow shadow-indigo-500 hover:bg-indigo-600"
			on:click={showDailySalesModal}>Ventas del día</button
		>

		<button
			type="submit"
			class="w-full rounded bg-indigo-500 py-2 text-white shadow shadow-indigo-500 hover:bg-indigo-600"
			>...</button
		>
	</div>
</div>
