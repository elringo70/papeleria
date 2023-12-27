<script>
	import { getContext } from 'svelte';
	import Icon from '@iconify/svelte';

	const focusInputElement = getContext('focusInputElement');
	const selectedTicket = getContext('selectedTicket');
	const tickets = getContext('tickets');

	function deductProduct(productId) {
		tickets.deductProduct(productId);
		focusInputElement();
	}

	function removeProduct(productId) {
		tickets.removeProduct(productId);
		focusInputElement();
	}

	function addProduct(productId) {
		const productsStock = $selectedTicket.products;

		productsStock.forEach((product) => {
			if (productId === product.product._id && !product.product.requiredStock) {
				tickets.addProduct(productId);
			}

			if (productId === product.product._id && product.product.stock?.stock > product.quantity) {
				tickets.addProduct(productId);
			}
		});
		focusInputElement();
	}
</script>

<div class="h-full overflow-auto">
	<table class="w-full table-fixed">
		<thead>
			<tr class="bg-gray-200 text-xs uppercase leading-normal text-gray-600">
				<th class="w-2/12 px-3 py-2 text-left">Código</th>
				<th class="w-3/12 px-3 py-2 text-center">Producto</th>
				<th class="px-3 py-2 text-center">Precio</th>
				<th class="px-3 py-2 text-center">Cantidad</th>
				<th class="px-3 py-2 text-center">Total</th>
				<th class="px-3 py-2 text-center">Existencia</th>
				<th class="px-3 py-2 text-center">Acción</th>
				<th class="px-3 py-2 text-center">+ / -</th>
			</tr>
		</thead>
		<tbody class="text-sm font-light text-gray-600">
			{#each $selectedTicket.products as ticket}
				<tr class="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
					<td class="px-2 py-1.5 text-left text-xs">{ticket.product._id}</td>
					<td class="overflow-hidden text-ellipsis whitespace-nowrap px-2 py-1.5 text-left text-xs"
						>{ticket.product.product}</td
					>
					<td class="px-2 py-1.5 text-center">$ {ticket.product.price}</td>
					<td class="px-2 py-1.5 text-center">{ticket.quantity}</td>
					<td class="px-2 py-1.5 text-center">$ {ticket.quantity * ticket.product.price}</td>
					<td class="px-2 py-1.5 text-center">
						{#if ticket.product.requiredStock}
							{ticket.product?.stock?.stock - ticket.quantity}
						{:else}
							ilimitado
						{/if}
					</td>

					<td class="flex items-center justify-center gap-x-2 px-2 py-1.5 text-center">
						<button
							on:click={() => {
								removeProduct(ticket.product._id);
							}}
						>
							<div class="cursor-pointer text-base hover:text-red-700">
								<Icon icon="uil:trash-alt" />
							</div>
						</button>
					</td>
					<td class="px-2 py-1.5 text-center">
						<div class="flex justify-around">
							<button
								type="button"
								class="cursor-pointer rounded-sm bg-gray-400 p-0.5 text-white"
								on:click={() => deductProduct(ticket.product._id)}
							>
								<Icon icon="ic:baseline-minus" />
							</button>
							<button
								type="button"
								class="cursor-pointer rounded-sm bg-blue-500 p-0.5 text-white"
								on:click={() => addProduct(ticket.product._id)}
							>
								<Icon icon="ic:baseline-plus" />
							</button>
						</div>
					</td>
				</tr>
			{:else}
				<tr class="border-b border-gray-200 bg-gray-50 italic text-gray-400 cursor-default">
					<td class="py-1.5 px-2 text-left">123456789</td>
					<td class="py-1.5 px-2 text-center">Borrador</td>
					<td class="py-1.5 px-2 text-center">$ 3.5</td>
					<td class="py-1.5 px-2 text-center">2</td>
					<td class="py-1.5 px-2 text-center">$ 7</td>
					<td class="py-1.5 px-2 text-center">ilimitado</td>

					<td class="flex items-center justify-center gap-x-2 px-2 py-1.5 text-center">
						<button>
							<div class="cursor-default text-base">
								<Icon icon="uil:trash-alt" />
							</div>
						</button>
					</td>
					<td class="py-1.5 px-2 text-center">
						<div class="flex justify-around">
							<button type="button" class="cursor-default rounded-sm bg-gray-200 p-0.5 text-white">
								<Icon icon="ic:baseline-minus" />
							</button>
							<button type="button" class="cursor-default rounded-sm bg-blue-300 p-0.5 text-white">
								<Icon icon="ic:baseline-plus" />
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

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
