<script>
	import { afterUpdate, onMount } from 'svelte';
	import { enhance } from '$app/forms';

	import { NumberField } from '$lib/components';

	export let setCustomerTicket;
	let inputElement;

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
			<NumberField placeholder="Numero del cliente" name="phone" />
			<div class="modal-action">
				<button class="btn" type="submit">Buscar</button>
				<button class="btn-error btn" type="button" on:click={customerSearchModal.close()}
					>Cancelar</button
				>
			</div>
		</form>
	</div>
</dialog>

<style>
	.btn {
		color: white;
	}
</style>
