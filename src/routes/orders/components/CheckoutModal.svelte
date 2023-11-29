<script>
	import { enhance } from '$app/forms';

	import Icon from '@iconify/svelte';

	import { selectedTicket } from '../store';
	import NumberField from '../../../lib/components/NumberField.svelte';
	import { onMount } from 'svelte';

	export let Form;
	let checkoutModal;
	let formCompleted = false;

	$: customerName = $selectedTicket.customer.name ?? '';
	$: phone = $selectedTicket.customer.phone ?? '';
	$: address = $selectedTicket.customer.address
		? $selectedTicket.customer.address.street + ' ' + $selectedTicket.customer.address.number
		: '';

	const handleSubmit = () => {
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					checkoutModal.close();
					break;
			}
		};
	};

	onMount(() => {
		checkoutModal = document.getElementById('checkoutModal');
	});
</script>

<dialog id="checkoutModal" class="modal">
	<div class="modal-box w-4/6 max-w-none rounded-none bg-white">
		<form action="?/submitOrder" method="post" use:enhance={handleSubmit} autocomplete="off">
			<div class="grid grid-cols-3 grid-rows-3 gap-5">
				<div class="col-span-2 row-span-3 border-2 border-gray-200 p-6">
					<div class="flex h-full flex-col justify-between gap-5">
						<div>
							<h4 class="text-md font-bold text-gray-600">SELECCIONE EL METODO DE PAGO</h4>
							<div class="grid grid-cols-3 gap-2">
								<div>
									<input
										class="hidden"
										type="radio"
										id="cash-payment-radio"
										name="payment-method"
										value="cash"
										checked
									/>
									<label
										for="cash-payment-radio"
										class="flex cursor-pointer flex-col border-2 border-gray-400 p-2"
									>
										<div class="flex flex-col items-center justify-center">
											<span class="text-3xl text-gray-500">
												<Icon icon="mdi:cash" />
											</span>
											<span class="mt-2 text-center text-base font-bold text-gray-700"
												>Efectivo</span
											>
										</div>
									</label>
								</div>
								<div>
									<input
										class="hidden"
										type="radio"
										id="credit-debit-radio"
										name="payment-method"
										value="credit-debit"
									/>
									<label
										for="credit-debit-radio"
										class="flex cursor-pointer flex-col border-2 border-gray-400 p-2"
									>
										<div class="flex flex-col items-center justify-center">
											<span class="text-3xl text-gray-500">
												<Icon icon="majesticons:creditcard" />
											</span>
											<span class="mt-2 text-center text-base font-bold text-gray-700"
												>Crédito o débito</span
											>
										</div>
									</label>
								</div>
								<div>
									<input
										class="hidden"
										type="radio"
										id="transfer-payment-radio"
										name="payment-method"
										value="e-transfer"
									/>
									<label
										for="transfer-payment-radio"
										class="flex cursor-pointer flex-col border-2 border-gray-400 p-2"
									>
										<div class="flex flex-col items-center justify-center">
											<span class="text-3xl text-gray-500">
												<Icon icon="solar:card-transfer-bold" />
											</span>
											<span class="mt-2 text-center text-base font-bold text-gray-700"
												>Transferencia</span
											>
										</div>
									</label>
								</div>
							</div>
						</div>

						<div class="flex gap-3">
							<div class="basis-1/2">
								<NumberField placeholder="Efectivo" name="cash" />
								<NumberField placeholder="Débito o Crédito" name="credit-debit" />
								<NumberField placeholder="Vales" name="food-stanps" />
								<NumberField placeholder="Transferencia" name="e-transfer" />
							</div>
							<div class="basis-1/2">1</div>
						</div>
					</div>
				</div>

				<div class="col-span-1 row-span-2 border-2 border-gray-200 p-6">
					<h4 class="text-md text-center font-bold text-gray-600">RESUMEN DE COMPRA</h4>
					<div class="pt-5 text-gray-600">
						<p>Cliente: {customerName}</p>
						<p>Numero: {phone}</p>
						<p>Dirección: {address}</p>
					</div>
				</div>

				<div class="col-span-1 row-span-1">
					<div class="grid grid-cols-1 grid-rows-1 gap-2">
						<div class="col-span-1 row-span-1">
							<button
								type="submit"
								class="btn-outline btn btn-block btn-sm rounded-none"
								disabled={formCompleted}>TERMINAR COMPRA</button
							>
						</div>
						<div class="col-span-1 row-span-1">
							<button
								type="button"
								class="btn-info btn-outline btn btn-block btn-sm rounded-none"
								disabled={formCompleted}>TERMINAR E IMPRIMIR</button
							>
						</div>
						<div class="col-span-1 row-span-1">
							<button
								type="button"
								on:click={checkoutModal.close()}
								class="btn-outline btn-error btn btn-block btn-sm rounded-none">CANCELAR</button
							>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
</dialog>

<style>
	input:checked + label {
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		background-color: rgb(14 165 233);
		border-color: rgb(14 165 233);
	}

	input:checked + label span {
		color: white;
	}

	.btn:hover {
		color: white;
	}
</style>
