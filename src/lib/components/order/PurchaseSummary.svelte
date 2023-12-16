<script>
	import { getContext } from 'svelte';
	import { Pill } from '$lib/components';

	import { customerNameFormat, phoneNumberFormat } from '$utils/stringUtils';
	import { decimalsFixed } from '$utils/numberUtils';

	export let showPurchaseModal;
	const selectedTicket = getContext('selectedTicket');

	let customerName = '',
		customerAddress,
		phoneNumber,
		subtotal,
		total;

	$: customerName =
		JSON.stringify($selectedTicket.customer) === '{}'
			? ''
			: JSON.stringify($selectedTicket.customer) !== '{}' &&
			  $selectedTicket.customer.hasOwnProperty('name')
			? customerNameFormat($selectedTicket.customer)
			: '';
	$: phoneNumber = $selectedTicket.customer.phone
		? phoneNumberFormat($selectedTicket.customer.phone)
		: '';
	$: customerAddress = $selectedTicket.customer.address
		? `${$selectedTicket.customer.address.street}, ${$selectedTicket.customer.address.number}`
		: '';
	$: subtotal = decimalsFixed(subtotalProducts($selectedTicket.products), 2);
	$: IVA = taxes($selectedTicket.products);
	$: total = decimalsFixed(subtotalProducts($selectedTicket.products), 2);

	$: status = $selectedTicket.status ? 'Entregado' : 'Sin Entregar';
	$: delivered = $selectedTicket.delivered ? 'Pagado' : 'Pendiente';

	const subtotalProducts = (products) => {
		let total = 0;
		if (products.length > 0) {
			for (let i = 0; i < products.length; i++) {
				total += products[i].product.price * products[i].quantity;
			}
		}
		return total;
	};

	const taxes = (products) => {
		const subtotal = subtotalProducts(products) * 0.16;
		return decimalsFixed(subtotal, 2);
	};
</script>

<div
	class="col-span-1 row-span-6 row-start-1 flex h-full grid-flow-col flex-col overflow-auto bg-white"
>
	<div>
		<div class="mb-7">
			<h3 class="text-2xl font-semibold text-gray-800">Resumen de la orden</h3>
			<p class="text-gray-400">
				Cliente: {customerName}
			</p>
			<p class="text-gray-400">
				Numero: {phoneNumber}
			</p>
			<p class="text-gray-400">
				Dirección: {customerAddress}
			</p>
		</div>
	</div>

	<div class="flex justify-around">
		<Pill pill="success" text={status} />
		<Pill pill="primary" text={delivered} />
	</div>

	<div class="w-full divide-y divide-solid">
		<div class="flex w-full justify-between py-3 text-gray-500">
			<div>Total de articulos</div>
			<div>{$selectedTicket.products.length}</div>
		</div>
		<div class="flex w-full justify-between py-3 text-gray-500">
			<div>Subtotal</div>
			<div>$ {subtotal}</div>
		</div>
		<div class="flex w-full justify-between py-3 text-gray-500">
			<div>IVA</div>
			<div>$ {IVA}</div>
		</div>
		<div class="flex w-full justify-between py-6">
			<h3 class="text-xl font-semibold text-gray-800">Total de la orden</h3>
			<h3 class="text-xl font-semibold text-gray-800">$ {total}</h3>
		</div>
	</div>
	<div class="mt-auto">
		<button
			type="button"
			class="w-full rounded bg-indigo-600 py-2 text-white hover:bg-indigo-700"
			on:click={showPurchaseModal}>Completar orden</button
		>
	</div>
</div>
