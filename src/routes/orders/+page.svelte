<script>
	import { setContext, onMount, getContext } from 'svelte';
	import { tickets, selectedTicket } from './stores/store';

	import Swal from 'sweetalert2';

	import PurchaseSummary from '$lib/components/order/PurchaseSummary.svelte';
	import TicketDetail from '$lib/components/order/TicketDetail.svelte';
	import TicketList from '$lib/components/order/TicketList.svelte';
	import ProductInput from '$lib/components/order/ProductInput.svelte';
	import CheckoutModal from './components/CheckoutModal.svelte';
	import CustomerSearchModal from './components/CustomerSearchModal.svelte';
	import SearchProductModal from './components/SearchProductModal.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	let checkoutModal;
	let searchProductModal;
	let ticketPosition;
	let elementCustomerSearchModal;

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

	const customerSearchModal = (index) => {
		elementCustomerSearchModal.showModal();
		ticketPosition = index;
	};

	const onKeyDown = (event) => {
		switch (event.key) {
			case 'Escape':
				break;
			case 'F1':
				event.preventDefault();
				break;
			case 'F2':
				showPurchaseModal();
				break;
			case 'F10':
				event.preventDefault();
				showSearchModal();
				break;
			case 'F11':
				event.preventDefault();
			case 'F12':
				event.preventDefault();
				break;
		}
	};

	const showSearchModal = () => {
		searchProductModal.showModal();
	};

	let bindInputElement;
	const focusInputElement = () => {
		if (!bindInputElement) return;

		setTimeout(() => {
			bindInputElement.focus();
		}, 100);
	};

	const showPurchaseModal = () => {
		if ($selectedTicket.products.length === 0) return;
		checkoutModal.showModal();
	};

	onMount(() => {
		checkoutModal = document.getElementById('checkoutModal');
		searchProductModal = document.getElementById('searchProductModal');
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
		<PurchaseSummary {showPurchaseModal} />
	</div>
</section>

<SearchProductModal />

<CustomerSearchModal {setCustomerTicket} />

<CheckoutModal Form={form} />
