<script>
	import { setContext, onMount, onDestroy } from 'svelte';
	import { tickets, selectedTicket } from './stores/store';
	import { dailySalesStore } from './stores/dailySalesStore';
	import { modalsStore } from './stores/modalsStore';

	import PurchaseSummary from '$lib/components/order/PurchaseSummary.svelte';
	import TicketDetail from '$lib/components/order/TicketDetail.svelte';
	import TicketList from '$lib/components/order/TicketList.svelte';
	import ProductInput from '$lib/components/order/ProductInput.svelte';
	import CheckoutModal from './components/CheckoutModal.svelte';
	import CustomerSearchModal from './components/CustomerSearchModal.svelte';
	import SearchProductModal from './components/SearchProductModal.svelte';
	import DailySalesModal from './components/DailySalesModal.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	let checkoutModal;
	let searchProductModal;
	let elementCustomerSearchModal;
	let dailySalesModal;

	const onKeyDown = (event) => {
		switch (event.key) {
			case 'F1':
				event.preventDefault();
				break;
			case 'F10':
				event.preventDefault();
				showSearchModal();
				break;
			case 'F12':
				event.preventDefault();
				showPurchaseModal();
				break;
		}
	};

	const showCustomerSearchModal = () => {
		elementCustomerSearchModal.showModal();
	};

	const showDailySalesModal = async () => {
		await getDailySales();
		await dailySalesModal.showModal();
	};

	const getDailySales = async () => {
		const fromDate = new Date();
		const toDate = new Date();

		try {
			const response = await fetch(`/api/orders?fromDate=${fromDate}&toDate=${toDate}`);
			const data = await response.json();
			dailySalesStore.setData(data);
		} catch (error) {
			console.log(error);
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

	const setModals = () => {
		const modals = [...document.getElementsByTagName('dialog')];
		modalsStore.setModals(modals);
	};

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			console.log(mutation);
		}
	});

	onMount(() => {
		checkoutModal = document.getElementById('checkoutModal');
		searchProductModal = document.getElementById('searchProductModal');
		elementCustomerSearchModal = document.getElementById('customerSearchModal');
		dailySalesModal = document.getElementById('dailySalesModal');

		observer.observe(checkoutModal, { attributes: true });

		setModals();
	});

	setContext('selectedTicket', selectedTicket);
	setContext('tickets', tickets);

	onDestroy(() => {
		observer.disconnect();
	});
</script>

<svelte:window on:keydown={onKeyDown} />

<svelte:head>
	<title>Caja</title>
</svelte:head>

<section class="grid h-[calc(100vh-60px)] grid-cols-12 grid-rows-6 gap-4 bg-gray-100 p-7">
	<!-- Ticket List -->
	<div
		class="col-span-2 row-span-6 row-start-1 flex h-full flex-col overflow-auto rounded bg-white shadow-md"
	>
		<TicketList {showCustomerSearchModal} {focusInputElement} />
	</div>

	<!-- Add Product Input Component -->
	<div class="col-span-7 row-span-2 row-start-1 rounded bg-white shadow-md">
		<ProductInput
			{focusInputElement}
			bind:bindInputElement
			{showSearchModal}
			{showDailySalesModal}
		/>
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

<CustomerSearchModal {elementCustomerSearchModal} />

<CheckoutModal Form={form} />

<DailySalesModal
	{focusInputElement}
	dailySales={$dailySalesStore}
	on:dailySalesReset={getDailySales}
/>
