<script>
	import { onMount } from 'svelte';
	import { Input } from '$lib/components';
	import { selectedTicket } from './../stores/dailySalesStore';

	export let focusInputElement;
	export let dailySales;

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
		console.log(index);
	};

	onMount(() => {
		addEventListener('keydown', function (event) {
			switch (event.key) {
				case 'Escape':
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
					<Input placeholder="Buscar venta" />
				</div>

				<div class="col-span-1 row-span-4 border-2 border-gray-200 p-3">
					<div class="flex h-full flex-col justify-between">
						<div class="overflow-x-auto">
							<table class="w-full text-left text-sm text-gray-500">
								<thead class="bg-gray-50 text-center text-xs uppercase text-gray-800">
									<tr class="text-center">
										<th class="p-2">Cantidad</th>
										<th class="p-2">Producto</th>
										<th class="p-2">Importe</th>
									</tr>
								</thead>
								<tbody class="text-xs text-gray-700">
									<tr class="cursor-default select-none border-b bg-white py-1 text-center text-xs">
										<td class="px-3 py-1.5">''</td>
										<td class="px-3 py-1.5">''</td>
										<td class="px-3 py-1.5">''</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="text-gray-700">
							<div>total</div>
							<div>pago con</div>
						</div>
					</div>
				</div>

				<div class="col-span-1 row-span-3 border-2 border-gray-200 p-3">
					<div class="overflow-x-auto">
						<table class="w-full text-left text-sm text-gray-500">
							<thead class="bg-gray-50 text-center text-xs uppercase text-gray-800">
								<tr class="text-center">
									<th class="p-2 text-left">ID</th>
									<th class="p-2">Articulos</th>
									<th class="p-2">Hora</th>
									<th class="p-2">Total</th>
								</tr>
							</thead>
							<tbody class="text-xs text-gray-700">
								{#each dailySales as sale, index}
									<tr
										class="cursor-default select-none border-b bg-white py-1 text-center text-xs"
										on:click={() => {
											handleSelectTicket(index);
										}}
									>
										<td class="px-3 py-1.5 text-left">{sale._id}</td>
										<td class="px-3 py-1.5">{getProductsLength(sale.products)}</td>
										<td class="px-3 py-1.5">{getHourTime(sale.createdAt)}</td>
										<td class="px-3 py-1.5">${getTotal(sale.products)}</td>
									</tr>
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
					<div class="flex h-full gap-5">
						<button
							type="button"
							class="w-full rounded bg-red-500 py-2 text-white shadow shadow-red-500 hover:bg-red-600"
							>Cancelar Venta</button
						>
						<button
							type="button"
							class="w-full rounded bg-indigo-500 py-2 text-white shadow shadow-indigo-500 hover:bg-indigo-600"
							>...</button
						>
						<button
							type="button"
							class="w-full rounded bg-gray-500 py-2 text-white shadow shadow-gray-500 hover:bg-gray-600"
							>Imprimir Copia</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</dialog>
