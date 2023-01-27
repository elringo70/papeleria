<script>
	import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';
	import { Input, Pill } from '$lib/components';

	import Icon from '@iconify/svelte';
	import Swal from 'sweetalert2';

	import { firstUppercase, phoneNumberFormat } from '$utils/stringUtils';

	export let data;

	let errors;
	$: errors;

	//Search find customer function
	let customers;
	$: customers = data.customers;
	const filteredCustomers = (e) => {
		const searchValue = e.target.value;

		customers = data.customers.filter(
			(customer) =>
				customer.phone.includes(searchValue) ||
				customer.name.toLowerCase().includes(searchValue.toLowerCase())
		);
	};

	async function deleteCustomer() {
		const modalConfirmation = await Swal.fire({
			icon: 'warning',
			title: '¿Desea eliminar al cliente?',
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Eliminar'
		});

		if (modalConfirmation.isConfirmed) {
			const data = new FormData(this);

			const response = await fetch(this.action, {
				method: 'POST',
				body: data
			});

			const result = deserialize(await response.text());

			switch (result.type) {
				case 'success':
					Swal.fire({
						icon: 'success',
						title: 'Eliminado'
					});

					await invalidateAll();

					break;
				case 'failure':
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: result.data.message
					});
					break;
			}
			applyAction(result);
		}
	}
</script>

<svelte:head>
	<title>Clientes</title>
</svelte:head>

<div class="overflow-x-auto">
	<div class="min-w-screen flex min-h-screen justify-center overflow-hidden bg-gray-100 font-sans">
		<div class="w-full lg:w-5/6">
			<div class="mt-5 border shadow-lg">
				<div class="bg-gray-200 py-3 px-6 text-sm font-bold uppercase leading-normal text-gray-600">
					Nombre del cliente
				</div>
				<div class="mt-2 p-5">
					<Input
						placeholder="Buscar cliente"
						name="name"
						errors={errors?.name}
						onInput={filteredCustomers}
					/>
				</div>
			</div>

			<div class="my-6 rounded bg-white shadow-lg">
				<table class="w-full min-w-max table-auto">
					<thead>
						<tr class="bg-gray-200 text-sm uppercase leading-normal text-gray-600">
							<th class="py-3 px-6 text-left">Número</th>
							<th class="py-3 px-6 text-left">Cliente</th>
							<th class="py-3 px-6 text-center">Dirección</th>
							<th class="py-3 px-6 text-center">Status</th>
							<th class="py-3 px-6 text-center">Acciones</th>
						</tr>
					</thead>
					<tbody class="text-sm font-light text-gray-600">
						{#each customers as customer}
							<tr class="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
								<td class="py-3 px-6 text-left">
									<div class="flex items-center">
										<span class="font-medium">{phoneNumberFormat(customer.phone)}</span>
									</div>
								</td>
								<td class="py-3 px-6 text-left">
									<div class="flex items-center">
										<span
											>{firstUppercase(customer.name)}
											{customer.lastName ? firstUppercase(customer.lastName) : ''}</span
										>
									</div>
								</td>
								<td class="py-3 px-6 text-center">
									<div class="flex items-center justify-center">
										{#if customer.address}
											{customer.address?.street} {customer.address?.number}
										{:else}
											<div class="italic text-gray-400">...sin dirección</div>
										{/if}
									</div>
								</td>
								<td class="py-3 px-6 text-center">
									<Pill pill="active" />
								</td>
								<td class="flex items-center justify-center gap-x-2 py-3 px-6 text-center">
									<form action="" method="post">
										<input type="hidden" name="id" value={customer._id} />
										<button>
											<div class="hover:text-purple-500">
												<Icon icon="ic:outline-remove-red-eye" />
											</div>
										</button>
									</form>
									<form action="" method="post">
										<input type="hidden" name="id" value={customer._id} />
										<button>
											<div class="hover:text-purple-500">
												<Icon icon="mdi:pencil" />
											</div>
										</button>
									</form>
									<form action="?/delete" method="POST" on:submit|preventDefault={deleteCustomer}>
										<input type="hidden" name="id" value={customer._id} />
										<button>
											<div class="cursor-pointer text-base hover:text-red-700">
												<Icon icon="uil:trash-alt" />
											</div>
										</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
