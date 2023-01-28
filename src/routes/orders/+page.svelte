<script>
	import { enhance } from '$app/forms';
	import { tickets, selectedTicket } from './store';

	import Icon from '@iconify/svelte';
	import Swal from 'sweetalert2';
	import Ticket from '$lib/components/order/Ticket.svelte';
	import { Input } from '$lib/components';

	let loading = false;

	function addTicket() {
		tickets.addTicket();
	}

	function selectTicket(index) {
		tickets.selectTicket(index);
	}

	async function removeTicket(e) {
		e.stopPropagation();

		const index = this.value;

		if ($tickets[index].products.length > 0) {
			const modalConfirmation = await Swal.fire({
				icon: 'warning',
				title: '¿Desea eliminar el ticket?',
				showCancelButton: true,
				cancelButtonText: 'Cancelar',
				confirmButtonText: 'Eliminar'
			});

			if (modalConfirmation.isConfirmed) {
				tickets.removeTicket(index);
			}
		} else {
			tickets.removeTicket(index);
		}
	}

	function addProductToTicket({ form, data }) {
		loading = true;
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					tickets.addProductToTicket(result.data.product);
					await update();
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
			loading = false;
		};
	}

	function removeProduct(productId) {
		tickets.removeProduct(productId);
	}

	function addProduct(productId) {
		tickets.addProduct(productId);
	}

	function deductProduct(productId) {
		tickets.deductProduct(productId);
	}

	function addCustomer(index) {}

	function findCustomer(phone) {}
</script>

<svelte:head>
	<title>Cliente nuevo</title>
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
</svelte:head>

<section class="grid-rows-6/6 grid h-[calc(100vh-66px)] grid-cols-6 gap-4 bg-gray-100 p-7">
	<!-- Ticket List -->
	<div
		class="col-span-1 row-span-6 row-start-1 flex h-full grid-flow-col flex-col overflow-auto rounded bg-white shadow-md"
	>
		<div class="overflow-auto">
			{#each $tickets as ticket, index}
				<Ticket
					{ticket}
					{index}
					onClick={() => selectTicket(index)}
					onDblClick={() => addCustomer(index)}
					{removeTicket}
				/>
			{/each}
		</div>
		<div class="mt-auto">
			<button
				type="button"
				class="mt-auto w-full bg-indigo-600 py-2 text-white hover:bg-indigo-700"
				disabled={loading}
				on:click={addTicket}>Agregar ticket</button
			>
		</div>
	</div>

	<!-- Add Product Input Component -->
	<div class="col-span-3 row-span-1 row-start-1 rounded bg-white shadow-md">
		<form action="?/findProduct" method="post" use:enhance={addProductToTicket} autocomplete="off">
			<div class="flex flex-row items-end justify-around pt-3 align-bottom">
				<div class="basis-4/6">
					<Input label="Código" name="product" value={''} />
				</div>
				<div class="basis-1/6">
					<button
						type="submit"
						class="mb-3 w-full rounded bg-indigo-500 py-2 text-white hover:bg-indigo-600"
						>Agregar</button
					>
				</div>
			</div>
		</form>
	</div>

	<!-- Ticket Detail -->
	<div class="col-span-3 row-span-5 row-start-2 overflow-auto rounded bg-white shadow-md">
		<table class="w-full table-auto">
			<thead>
				<tr class="bg-gray-200 text-xs uppercase leading-normal text-gray-600">
					<th class="py-2 px-3 text-left">Código</th>
					<th class="py-2 px-3 text-center">Producto</th>
					<th class="py-2 px-3 text-center">Precio</th>
					<th class="py-2 px-3 text-center">Cantidad</th>
					<th class="py-2 px-3 text-center">Total</th>
					<th class="py-2 px-3 text-center">Existencia</th>
					<th class="py-2 px-3 text-center">Acción</th>
					<th class="py-2 px-3 text-center">+ / -</th>
				</tr>
			</thead>
			<tbody class="text-sm font-light text-gray-600">
				{#each $selectedTicket.products as ticket}
					<tr class="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
						<td class="py-1.5 px-2 text-left">{ticket.product._id}</td>
						<td class="py-1.5 px-2 text-center">{ticket.product.product}</td>
						<td class="py-1.5 px-2 text-center">$ {ticket.product.price}</td>
						<td class="py-1.5 px-2 text-center">{ticket.quantity}</td>
						<td class="py-1.5 px-2 text-center">$ {ticket.quantity * ticket.product.price}</td>
						<td class="py-1.5 px-2 text-center">{ticket.product.stock.stock - ticket.quantity}</td>

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
						<td class="py-1.5 px-2 text-center">
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
								<button
									type="button"
									class="cursor-default rounded-sm bg-gray-200 p-0.5 text-white"
								>
									<Icon icon="ic:baseline-minus" />
								</button>
								<button
									type="button"
									class="cursor-default rounded-sm bg-blue-300 p-0.5 text-white"
								>
									<Icon icon="ic:baseline-plus" />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Purchase summary -->
	<div class="col-span-2 row-span-6 row-start-1 rounded bg-white shadow-md">3</div>
</section>
