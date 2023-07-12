<script>
	import { setContext } from 'svelte';
	import { deserialize, applyAction } from '$app/forms';
	import { tickets, selectedTicket } from './store';

	import Swal from 'sweetalert2';
	import SearchProductModal from '$lib/components/modal/SearchProductModal.svelte';

	import { onMount } from 'svelte';
	import CustomerSearchModal from '../../lib/components/modal/CustomerSearchModal.svelte';
	import PurchaseSummary from '../../lib/components/order/PurchaseSummary.svelte';
	import TicketDetail from '../../lib/components/order/TicketDetail.svelte';
	import TicketList from '../../lib/components/order/TicketList.svelte';
	import ProductInput from '../../lib/components/order/ProductInput.svelte';

	const setCustomerTicket = () => {
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					if (result.data.customer) {
						tickets.setCustomerTicket(ticketPosition, result.data.customer);
					} else {
						tickets.setCustomerTicket(ticketPosition, result.data.phone);
					}
					showCustomerSearchModal = false;
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
			await update();
		};
	};

	//Modal
	let showCustomerSearchModal = false;
	let ticketPosition;

	const customerSearchModal = (index) => {
		showCustomerSearchModal = true;
		ticketPosition = index;
	};

	const onKeyDown = (event) => {
		switch (event.key) {
			case 'F10':
				openSearchModal();
				break;
			case 'Escape':
				closeSearchModal();
				break;
		}
	};

	let products = [];
	$: products;
	const productSearch = () => {
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					products = result.data.products;
					break;
			}
		};
	};

	let showSearchModal = false;
	function openSearchModal() {
		showSearchModal = true;
	}

	function closeSearchModal() {
		showSearchModal = false;
		products = [];
	}

	async function selectProductFromModal(event) {
		const form = new FormData();
		const product = event.detail._id;
		form.append('product', product);

		try {
			const response = await fetch('?/findProduct', {
				method: 'POST',
				body: form
			});

			const result = deserialize(await response.text());

			switch (result.type) {
				case 'success':
					if (result.data.product.stock.stock === 0) {
						Swal.fire({
							icon: 'error',
							title: 'Producto sin stock',
							timer: 1250,
							timerProgressBar: true
						});
						break;
					} else {
						tickets.addProductToTicket(result.data.product);
						closeSearchModal();
					}
					break;
			}
			applyAction(result);
		} catch (error) {
			console.log(error);
		}
	}

	let bindInputElement;
	const focusInputElement = () => {
		if (!bindInputElement) return;

		setTimeout(() => {
			bindInputElement.focus();
		}, 100);
	};

	onMount(() => {
		focusInputElement();
	});

	setContext('selectedTicket', selectedTicket);
	setContext('tickets', tickets);
</script>

<svelte:window on:keydown={onKeyDown} />

<svelte:head>
	<title>Cliente nuevo</title>
</svelte:head>

<section class="grid-rows-6/6 grid h-[calc(100vh-60px)] grid-cols-12 gap-4 bg-gray-100 p-7">
	<!-- Ticket List -->
	<div
		class="col-span-2 row-span-6 row-start-1 flex h-full flex-col overflow-auto rounded bg-white shadow-md"
	>
		<TicketList {customerSearchModal} {focusInputElement} />
	</div>

	<!-- Add Product Input Component -->
	<div class="col-span-7 row-span-1 row-start-1 rounded bg-white shadow-md">
		<ProductInput {focusInputElement} bind:bindInputElement />
	</div>

	<!-- Ticket Detail -->
	<div class="col-span-7 row-span-5 row-start-2 overflow-auto rounded bg-white shadow-md">
		<TicketDetail {focusInputElement} />
	</div>

	<!-- Purchase summary -->
	<div class="col-span-3 row-span-6 row-start-1 rounded bg-white p-5 shadow-md">
		<PurchaseSummary />
	</div>
</section>

<CustomerSearchModal bind:showCustomerSearchModal {setCustomerTicket} />

<SearchProductModal
	{productSearch}
	{products}
	bind:showSearchModal
	on:productId={selectProductFromModal}
/>

<style>
	::-webkit-scrollbar {
		width: 0.5em;
	}
	::-webkit-scrollbar-track {
		background-color: rgb(229 231 235);
		border-radius: 100vw;
	}
	::-webkit-scrollbar-thumb {
		background-color: rgb(209 213 219);
		border-radius: 100vw;
	}
</style>
