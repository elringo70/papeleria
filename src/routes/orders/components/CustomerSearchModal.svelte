<script>
	import { afterUpdate, onMount, getContext } from 'svelte';
	import { enhance } from '$app/forms';

	import { NumberField } from '$lib/components';

	export let elementCustomerSearchModal;
	const tickets = getContext('tickets');
	let inputElement;

	const setCustomerTicket = () => {
		return async ({ result, update }) => {
			const { type, data } = result;

			switch (type) {
				case 'success':
					if (data.customer) {
						tickets.setCustomerTicket(data.customer);
					} else {
						tickets.setCustomerTicket(data.phone);
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

	afterUpdate(async () => {
		if (inputElement) {
			setTimeout(() => {
				inputElement.focus();
			}, 100);
		}
	});

	let customerSearchModal;
	onMount(() => {
		customerSearchModal = document.getElementById('customerSearchModal');
	});
</script>

<dialog id="customerSearchModal" class="modal">
	<div class="modal-box w-1/3 max-w-none rounded-none bg-white text-gray-700">
		<h3 class="text-lg font-bold">Buscar cliente</h3>
		<form action="?/findCustomer" use:enhance={setCustomerTicket} method="post" autocomplete="off">
			<NumberField
				placeholder="Numero del cliente"
				name="phone"
				minlength="10"
				maxlength="10"
				required
			/>
			<div class="modal-action">
				<button class="btn-error btn" type="button" on:click={customerSearchModal.close()}
					>Cancelar</button
				>
				<button class="btn" type="submit">Buscar</button>
			</div>
		</form>
	</div>
</dialog>

<style>
	.btn {
		color: white;
	}
</style>
