<script>
	import { getContext } from 'svelte';
	import { Pill } from '$lib/components';

	import { customerNameFormat, phoneNumberFormat } from '$utils/stringUtils';

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
		? `${$selectedTicket.customer.address.street} ${$selectedTicket.customer.address.number}`
		: '';
	$: subtotal = subtotalProducts($selectedTicket.products);
	$: total =
		subtotalProducts($selectedTicket.products) * 0.16 + subtotalProducts($selectedTicket.products);

	const orderStatus = {
		status: {
			open: 'Abierto',
			pending: 'Pendiente',
			closed: 'Cerrado'
		},
		delivered: {
			pending: 'Pendiente',
			delivered: 'Entregado'
		}
	};

	$: status = orderStatus.status[$selectedTicket.status];
	$: delivered = orderStatus.delivered[$selectedTicket.delivered];

	const subtotalProducts = (products) => {
		let total = 0;
		if (products.length > 0) {
			for (let i = 0; i < products.length; i++) {
				total += products[i].product.price * products[i].quantity;
			}
		}
		return total;
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

	<div class="divide-y divide-solid overflow-auto">
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
			<div>$ {subtotalProducts($selectedTicket.products) * 0.16}</div>
		</div>
		<div class="flex w-full justify-between py-6">
			<h3 class="text-xl font-semibold text-gray-800">Total de la orden</h3>
			<h3 class="text-xl font-semibold text-gray-800">$ {total}</h3>
		</div>
	</div>
	<div class="mt-auto">
		<button type="button" class="w-full rounded bg-indigo-600 py-2 text-white hover:bg-indigo-700"
			>Completar orden</button
		>
	</div>
</div>
