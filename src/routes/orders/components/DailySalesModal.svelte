<script>
	import { onMount, createEventDispatcher, getContext } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	import Swal from 'sweetalert2';

	import { dailySalesStore, selectedTicket } from '../stores/dailySalesStore';
	import { Input } from '$lib/components';
	import { decimalsFixed } from '$utils/numberUtils';

	const focusInputElement = getContext('focusInputElement');

	export let dailySales;
	let dailySalesModal;

	$: selectedProducts = $selectedTicket.products || [];
	$: customerPayment = $selectedTicket.customerPayment || 0;
	$: total = $selectedTicket.total || 0;

	const dispatch = createEventDispatcher();

	const getHourTime = (timeStamp) => {
		return new Date(timeStamp).toLocaleTimeString('en-US');
	};

	const getProductsLength = (products) => {
		const initialValue = 0;
		return products.reduce(
			(accumulator, currentValue) => accumulator + currentValue.quantity,
			initialValue
		);
	};

	const getTotal = (products) => {
		const initialValue = 0;
		return products.reduce(
			(accumulator, currentValue) => accumulator + currentValue.product.price,
			initialValue
		);
	};

	const handleSelectTicket = (index) => {
		dailySalesStore.selectTicket(index);
	};

	const closeDailySalesModal = () => {
		reset();
		dailySalesModal.close();
	};

	const reset = () => {
		dailySalesStore.reset();
	};

	/** @param {{ currentTarget: EventTarget & HTMLFormElement}} event */
	async function handleSubmit(event) {
		dailySalesModal.close();

		const currentTarget = event.currentTarget;
		const action = event.currentTarget.action;

		const confirmationModal = await Swal.fire({
			icon: 'warning',
			title: '¿Desea cancelar la orden?',
			showCancelButton: true,
			cancelButtonText: 'Omitir',
			confirmButtonText: 'Cancelar'
		});

		if (confirmationModal.isConfirmed) {
			const data = new FormData(currentTarget);
			const response = await fetch(action, {
				method: 'POST',
				body: data
			});

			/** @type {import('@sveltejs/kit').ActionResult} */
			const result = deserialize(await response.text());

			switch (result.type) {
				case 'success':
					dispatch('dailySalesReset');
					await invalidateAll();
					dailySalesModal.showModal();
					break;
			}

			applyAction(result);
		} else {
			dailySalesModal.showModal();
		}
	}

	onMount(() => {
		dailySalesModal = document.getElementById('dailySalesModal');

		addEventListener('keydown', function (event) {
			switch (event.key) {
				case 'Escape':
					reset();
					focusInputElement();
					break;
			}
		});
	});
</script>

<dialog id="dailySalesModal" class="modal">
	<div class="modal-box max-w-none rounded-none bg-white">
		<div>
			<h1 class="pb-2 text-center align-middle text-3xl text-gray-700">Ventas del día</h1>
			<div class="grid grid-cols-2 grid-rows-5 gap-5">
				<div class="col-span-1 row-span-1 border-2 border-gray-200 p-3">
					<Input placeholder="Buscar venta" name="search" />
				</div>

				<div class="col-span-1 row-span-4 border-2 border-gray-200 p-3">
					<div class="flex h-full flex-col justify-between">
						<div class="overflow-x-auto">
							<table class="w-full table-auto text-left text-sm text-gray-500">
								<thead class="bg-gray-100 text-center text-xs uppercase text-gray-800">
									<tr class="text-center">
										<th class="p-2">Cantidad</th>
										<th class="p-2">Producto</th>
										<th class="p-2">Importe</th>
									</tr>
								</thead>
								<tbody class="text-xs text-gray-700">
									{#each selectedProducts as product}
										<tr
											class="cursor-default select-none border-b bg-white py-1 text-center text-xs"
										>
											<td class="px-3 py-1.5">{product.quantity}</td>
											<td class="px-3 py-1.5">{product.product.product}</td>
											<td class="px-3 py-1.5">${decimalsFixed(product.product.price, 2)}</td>
										</tr>
									{:else}
										<tr
											class="cursor-default select-none border-b bg-white py-1 text-center text-xs text-gray-400 italic"
										>
											<td class="px-3 py-1.5">657df25d0e51ec9e16e35236</td>
											<td class="px-3 py-1.5">IMPRESION/COPIA CARTA B/N</td>
											<td class="px-3 py-1.5">$1.25</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						<div class="text-gray-700">
							<div class="flex justify-between">
								<div class="flex flex-col justify-end text-3xl">
									<div class="flex justify-between gap-5">
										<p>Total:</p>
										<p>${total}</p>
									</div>
									<div class="flex justify-between gap-5">
										<p>Pagó con:</p>
										<p>${customerPayment ?? '0'}</p>
									</div>
								</div>

								<div>
									{#if $selectedTicket.length > 0}
										<div class="text-end">
											<p>
												<b>Cliente:</b>
												{$selectedTicket.customer === 'walk-in'
													? 'Sin registro'
													: $selectedTicket.customer?.name +
													  ' ' +
													  $selectedTicket.customer?.lastName}
											</p>
											<p>
												<b>Numero:</b>
												{$selectedTicket.customer?.phone
													? $selectedTicket.customer.phone
													: 'Sin numero'}
											</p>
											<p>
												<b>Dirección:</b>
												{$selectedTicket.customer?.address
													? $selectedTicket.customer?.address?.street +
													  ' ' +
													  $selectedTicket.customer?.address?.number
													: 'Sin direcciónn'}
											</p>
										</div>
									{:else}
										<div class="text-end">
											<p>
												<b>Cliente:</b> <span class="italic text-gray-400">Cliente</span>
											</p>
											<p>
												<b>Numero:</b> <span class="italic text-gray-400">811-000-1234</span>
											</p>
											<p>
												<b>Dirección:</b>
												<span class="italic text-gray-400"> Calle 1, Colonia</span>
											</p>
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-span-1 row-span-3 border-2 border-gray-200 p-3">
					<div class="overflow-x-auto">
						<table class="w-full table-auto text-left text-sm text-gray-500">
							<thead class="bg-gray-100 text-center text-xs uppercase text-gray-800">
								<tr class="text-center">
									<th class="p-2 text-left">ID</th>
									<th class="p-2">Teléfono</th>
									<th class="p-2">Articulos</th>
									<th class="p-2">Hora</th>
									<th class="p-2">Total</th>
								</tr>
							</thead>
							<tbody class="text-xs text-gray-700">
								{#each dailySales as sale, index}
									{#if sale.orderStatus === 'cancelled'}
										<tr
											class="cursor-default select-none border-b py-1 text-center text-xs italic text-gray-400"
										>
											<td class="px-3 py-1.5 text-left">{sale._id}</td>
											<td class="px-3 py-1.5">{sale.customer.phone ?? 'Walk in'}</td>
											<td class="px-3 py-1.5">{getProductsLength(sale.products)}</td>
											<td class="px-3 py-1.5">{getHourTime(sale.createdAt)}</td>
											<td class="px-3 py-1.5">${getTotal(sale.products)}</td>
										</tr>
									{:else}
										<tr
											class="cursor-default select-none border-b py-1 text-center text-xs {$dailySalesStore[
												index
											].selectedTicket
												? 'bg-blue-500 text-white'
												: 'bg-white'}"
											on:click={() => {
												handleSelectTicket(index);
											}}
										>
											<td class="px-3 py-1.5 text-left">{sale._id}</td>
											<td class="px-3 py-1.5">{sale.customer.phone ?? 'Walk in'}</td>
											<td class="px-3 py-1.5">{getProductsLength(sale.products)}</td>
											<td class="px-3 py-1.5">{getHourTime(sale.createdAt)}</td>
											<td class="px-3 py-1.5">${getTotal(sale.products)}</td>
										</tr>
									{/if}
								{:else}
									<tr
										class="cursor-default select-none border-b bg-white py-1 text-center text-xs text-gray-400 italic"
									>
										<td class="px-3 py-1.5 text-left" />
										<td class="px-3 py-1.5" />
										<td class="px-3 py-1.5" />
										<td class="px-3 py-1.5" />
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>

				<div class="col-span-1 row-span-1 border-2 border-gray-200 p-3">
					<div class="flex h-full flex-col justify-center">
						<select class="select-bordered select select-md w-full bg-white text-gray-700">
							<option disabled selected>Cajero</option>
							<option>Luis Alvarez</option>
							<option>Administrador</option>
						</select>
					</div>
				</div>

				<div class="col-span-1 row-span-1 border-2 border-gray-200 p-3">
					<form class="h-full w-full" method="post" on:submit|preventDefault={handleSubmit}>
						<div class="flex h-full w-full gap-5">
							<input type="hidden" name="id" value={$selectedTicket._id} />
							<button
								type="submit"
								class="w-full rounded bg-red-500 py-2 text-white shadow shadow-red-500 hover:bg-red-600"
								formaction="?/cancelOrder">Cancelar Venta</button
							>
							<button
								type="button"
								class="w-full rounded bg-gray-500 py-2 text-white shadow shadow-gray-500 hover:bg-gray-600"
								>Imprimir Copia</button
							>
							<button
								type="button"
								class="w-full rounded bg-indigo-500 py-2 text-white shadow shadow-indigo-500 hover:bg-indigo-600"
								on:click={closeDailySalesModal}>Cerrar</button
							>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</dialog>
