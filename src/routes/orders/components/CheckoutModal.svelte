<script>
	import { getContext, onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { checkoutModalStore, derivedStore } from '../stores/checkoutModalStore';

	import { selectedTicket } from '../stores/store';
	import { CheckboxPressed, NumberField } from '$lib/components';

	let Form;
	export { Form as form };

	let checkoutModal;
	let formCompleted = false;

	$: customerName = $selectedTicket.customer.name ?? '';
	$: phone = $selectedTicket.customer.phone ?? '';
	$: address = $selectedTicket.customer.address
		? $selectedTicket.customer.address.street + ' ' + $selectedTicket.customer.address.number
		: '';

	const handleSubmit = ({ formData, cancel }) => {
		const { status, delivery } = Object.fromEntries(formData);

		if (!(status && delivery)) {
			checkoutModal.close();
			cancel();
		}

		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					checkoutModal.close();
					break;
			}
		};
	};

	const checkedStatus = () => {
		tickets.checkedStatus();
	};

	const checkedDelivery = () => {
		tickets.checkedDelivery();
	};

	const onInput = (event, attribute) => {
		checkoutModalStore.setValue(attribute, event.target.value);
	};

	const onChange = (value, attribute) => {
		checkoutModalStore.setValue(attribute, value);
	};

	onMount(() => {
		checkoutModal = document.getElementById('checkoutModal');
	});

	const tickets = getContext('tickets');
	$: console.log($derivedStore);
</script>

<dialog id="checkoutModal" class="modal">
	<div class="modal-box w-4/6 max-w-none rounded-none bg-white">
		<form action="?/submitOrder" method="post" use:enhance={handleSubmit} autocomplete="off">
			<div class="grid grid-cols-3 grid-rows-3 gap-5">
				<div class="col-span-2 row-span-3 border-2 border-gray-200 p-3">
					<div class="flex h-full flex-col justify-between gap-5">
						<h1 class="text-center text-7xl text-gray-700">
							${$checkoutModalStore.total}
						</h1>

						<div class="grid grid-cols-3 gap-2">
							<CheckboxPressed
								name="cash"
								checkedText="Efectivo"
								unCheckedText="Efectivo"
								unCheckedIcon="mdi:cash"
								checkedIcon="mdi:cash"
								checked={$checkoutModalStore.cashEnable}
								onChange={() => onChange(!$checkoutModalStore.cashEnable, 'cashEnable')}
							/>
							<CheckboxPressed
								name="credit-debit"
								checkedText="Crédito o Débito"
								unCheckedText="Crédito o Débito"
								unCheckedIcon="majesticons:creditcard"
								checkedIcon="majesticons:creditcard"
								checked={$checkoutModalStore.creditDebitEnable}
								onChange={() =>
									onChange(!$checkoutModalStore.creditDebitEnable, 'creditDebitEnable')}
							/>
							<CheckboxPressed
								name="e-transfer"
								checkedText="Transferencia"
								unCheckedText="Transferencia"
								unCheckedIcon="solar:card-transfer-bold"
								checkedIcon="solar:card-transfer-bold"
								checked={$checkoutModalStore.eTransferEnable}
								onChange={() => onChange(!$checkoutModalStore.eTransferEnable, 'eTransferEnable')}
							/>
						</div>

						<div>
							<div class="flex gap-5">
								<div class="mb-3 flex basis-1/3 items-end justify-end">
									<p class="text-xl font-medium text-gray-700">Efectivo</p>
								</div>
								<div class="basis-2/3">
									<NumberField
										placeholder="$0.00"
										name="cash"
										onInput={(e) => onInput(e, 'cash')}
										disabled={!$checkoutModalStore.cashEnable}
									/>
								</div>
							</div>
							<div class="flex gap-5">
								<div class="mb-3 flex basis-1/3 items-end justify-end">
									<p class="text-xl font-medium text-gray-700">Crédito o Débito</p>
								</div>
								<div class="basis-2/3">
									<NumberField
										placeholder="$0.00"
										name="credit-debit"
										onInput={(e) => onInput(e, 'creditDebit')}
										disabled={!$checkoutModalStore.creditDebitEnable}
									/>
								</div>
							</div>
							<div class="flex gap-5">
								<div class="mb-3 flex basis-1/3 items-end justify-end">
									<p class="text-xl font-medium text-gray-700">Transferencia</p>
								</div>
								<div class="basis-2/3">
									<NumberField
										placeholder="$0.00"
										name="e-transfer"
										onInput={(e) => onInput(e, 'eTransfer')}
										disabled={!$checkoutModalStore.eTransferEnable}
									/>
								</div>
							</div>
						</div>

						<div>
							<div class="flex justify-end gap-5">
								<p class="text-2xl font-medium text-gray-900">Paga con:</p>
								<p class="text-3xl font-semibold text-gray-900">${$checkoutModalStore.total}</p>
							</div>
							<div class="flex justify-end gap-5">
								<p class="text-3xl font-medium text-gray-900">Su cambio:</p>
								<p class="text-3xl font-semibold text-gray-900">
									${$selectedTicket.total - $checkoutModalStore.total}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="col-span-1 row-span-2 border-2 border-gray-200 p-3">
					<div class="flex h-full flex-col justify-between">
						<div>
							<h4 class="text-md text-center font-bold text-gray-600">RESUMEN DE COMPRA</h4>
							<div class="pt-3 text-gray-600">
								<p>Cliente: {customerName}</p>
								<p>Numero: {phone}</p>
								<p>Dirección: {address}</p>
							</div>
						</div>
						<div class="grid-row-1 grid grid-cols-2 gap-2">
							<div class="col-span-1 row-span-1">
								<CheckboxPressed
									name="status"
									value={$selectedTicket.status}
									checked={$selectedTicket.status}
									checkedText="Cerrado"
									unCheckedText="Abierto"
									unCheckedIcon="solar:delivery-bold"
									checkedIcon="solar:delivery-linear"
									onChange={checkedStatus}
								/>
							</div>
							<div class="col-span-1 row-span-1">
								<CheckboxPressed
									name="delivery"
									value={$selectedTicket.delivered}
									checked={$selectedTicket.delivered}
									checkedText="Pagado"
									unCheckedText="Pendiente"
									unCheckedIcon="streamline:payment-10-solid"
									checkedIcon="streamline:payment-10"
									onChange={checkedDelivery}
								/>
							</div>
						</div>
					</div>
				</div>

				<div class="col-span-1 row-span-1">
					<div class="flex h-full flex-col justify-between">
						<button
							type="submit"
							class="btn-outline btn btn-block btn-sm rounded-none"
							disabled={formCompleted}>TERMINAR COMPRA</button
						>
						<button
							type="button"
							class="btn-info btn-outline btn btn-block btn-sm rounded-none"
							disabled={formCompleted}>TERMINAR E IMPRIMIR</button
						>
						<button
							type="button"
							on:click={checkoutModal.close()}
							class="btn-outline btn-error btn btn-block btn-sm rounded-none">CANCELAR</button
						>
					</div>
				</div>
			</div>

			<input type="hidden" name="change" value="" />
			<input type="hidden" name="customer" value={$selectedTicket.customer.phone} />
			{#each $selectedTicket.products as product, i}
				<input
					type="hidden"
					name={`products[${i}][${product.quantity}]`}
					value={product.product._id}
				/>
			{/each}
		</form>
	</div>
</dialog>

<style>
	input:checked + label {
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
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
