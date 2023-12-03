<script>
	import { setContext, onMount } from 'svelte';
	import { deserialize, applyAction } from '$app/forms';
	import { tickets, selectedTicket } from './stores/store';

	import Swal from 'sweetalert2';
	import SearchProductModal from '$lib/components/modal/SearchProductModal.svelte';

	import PurchaseSummary from '$lib/components/order/PurchaseSummary.svelte';
	import TicketDetail from '$lib/components/order/TicketDetail.svelte';
	import TicketList from '$lib/components/order/TicketList.svelte';
	import ProductInput from '$lib/components/order/ProductInput.svelte';
	import CheckoutModal from './components/CheckoutModal.svelte';
	import CustomerSearchModal from './components/CustomerSearchModal.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	const setCustomerTicket = () => {
		return async ({ result, update }) => {
			const { type, data } = result;

			switch (type) {
				case 'success':
					if (data.customer) {
						tickets.setCustomerTicket(ticketPosition, data.customer);
						tickets.selectTicket(ticketPosition);
					} else {
						tickets.setCustomerTicket(ticketPosition, data.phone);
						tickets.selectTicket(ticketPosition);
					}

					elementCustomerSearchModal.close();
					break;
				case 'failure':
					Swal.fire({
						icon: 'error',
						title: data.message,
						timer: 1250,
						timerProgressBar: true
					});
					break;
			}
			await update();
		};
	};

	//Modal
	let ticketPosition;

	let elementCustomerSearchModal;
	const customerSearchModal = (index) => {
		elementCustomerSearchModal.showModal();
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
			case 'F2':
				if ($selectedTicket.products.length === 0) return;
				showPurchaseModal();
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
		purchaseModal = false;
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

	let purchaseModal = false;
	const showPurchaseModal = () => {
		document.getElementById('checkoutModal').showModal();
	};

	onMount(() => {
		focusInputElement();
		elementCustomerSearchModal = document.getElementById('customerSearchModal');
	});

	setContext('selectedTicket', selectedTicket);
	setContext('tickets', tickets);
</script>

<svelte:window on:keydown={onKeyDown} />

<svelte:head>
	<title>Cliente nuevo</title>
</svelte:head>

<section class="grid h-[calc(100vh-60px)] grid-cols-12 grid-rows-6 gap-4 bg-gray-100 p-7">
	<!-- Ticket List -->
	<div
		class="col-span-2 row-span-6 row-start-1 flex h-full flex-col overflow-auto rounded bg-white shadow-md"
	>
		<TicketList {customerSearchModal} {focusInputElement} />
	</div>

	<!-- Add Product Input Component -->
	<div class="col-span-7 row-span-2 row-start-1 rounded bg-white shadow-md">
		<ProductInput {focusInputElement} bind:bindInputElement />
	</div>

	<!-- Ticket Detail -->
	<div class="col-span-7 row-span-4 row-start-3 rounded bg-white shadow-md">
		<TicketDetail {focusInputElement} />
	</div>

	<!-- Purchase summary -->
	<div class="col-span-3 row-span-6 row-start-1 rounded bg-white p-5 shadow-md">
		<PurchaseSummary />
	</div>
</section>

<CustomerSearchModal {setCustomerTicket} />

<SearchProductModal
	{productSearch}
	{products}
	bind:showSearchModal
	on:productId={selectProductFromModal}
/>

<CheckoutModal Form={form} />
