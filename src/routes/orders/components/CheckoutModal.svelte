<script>
	import { getContext, onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { checkoutModalStore } from '../stores/checkoutModalStore';
	import { paymentMethodsStore } from '../stores/paymentMethodsStore';

	import { selectedTicket } from '../stores/store';
	import { CheckboxPressed, NumberField } from '$lib/components';

	export let Form;

	let checkoutModal;
	let missingTotal = false;
	const tickets = getContext('tickets');

	$: customerName = $selectedTicket.customer.name ?? '';
	$: phone = $selectedTicket.customer.phone ?? '';
	$: address = $selectedTicket.customer.address
		? $selectedTicket.customer.address.street + ' ' + $selectedTicket.customer.address.number
		: '';
	$: submitButtonAvailable =
		$paymentMethodsStore.cash || $paymentMethodsStore.creditDebit || $paymentMethodsStore.eTransfer;

	const handleSubmit = ({ formData, cancel }) => {
		const { status, delivery } = Object.fromEntries(formData);

		checkoutModalStore.calculateTotal();

		if ($checkoutModalStore.customerPayment < $selectedTicket.total) {
			missingTotal = true;
			cancel();
		} else if (!(status && delivery)) {
			checkoutModal.close();
			missingTotal = false;
			cancel();
		}

		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					checkoutModal.close();
					tickets.completeOrder();
					resetModal();
					break;
			}
			missingTotal = false;
		};
	};

	const resumeOrder = () => {
		checkoutModal.close();
		resetModal();
	};

	const resetModal = () => {
		checkoutModalStore.reset();
		paymentMethodsStore.reset();
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

	const onChange = (attribute) => {
		if ($paymentMethodsStore[attribute]) {
			checkoutModalStore.setValue(attribute, 0);
		}
		paymentMethodsStore.setValue(attribute);
	};

	onMount(() => {
		checkoutModal = document.getElementById('checkoutModal');

		addEventListener('keydown', function (event) {
			switch (event.key) {
				case 'Escape':
					if ($checkoutModalStore.customerPayment < $selectedTicket.total) {
						missingTotal = false;
					}
					resetModal();
					break;
			}
		});
	});
</script>

<dialog id="checkoutModal" class="modal">
	<div class="modal-box w-4/6 max-w-none rounded-none bg-white">
		<form action="?/submitOrder" method="post" use:enhance={handleSubmit} autocomplete="off">
			<div class="grid grid-cols-3 grid-rows-3 gap-5">
				<div class="col-span-2 row-span-3 border-2 border-gray-200 p-3">
					<div class="flex h-full flex-col justify-between gap-5">
						<h1 class="text-center text-7xl text-gray-700">
							${$selectedTicket.total}
						</h1>

						<div class="grid grid-cols-3 gap-2">
							<CheckboxPressed
								name="payment-cash"
								checkedText="Efectivo"
								unCheckedText="Efectivo"
								unCheckedIcon="mdi:cash"
								checkedIcon="mdi:cash"
								checked={$paymentMethodsStore.cash}
								onChange={() => onChange('cash')}
							/>
							<CheckboxPressed
								name="payment-credit-debit"
								checkedText="Crédito o Débito"
								unCheckedText="Crédito o Débito"
								unCheckedIcon="majesticons:creditcard"
								checkedIcon="majesticons:creditcard"
								checked={$paymentMethodsStore.creditDebit}
								onChange={() => onChange('creditDebit')}
							/>
							<CheckboxPressed
								name="payment-e-transfer"
								checkedText="Transferencia"
								unCheckedText="Transferencia"
								unCheckedIcon="solar:card-transfer-bold"
								checkedIcon="solar:card-transfer-bold"
								checked={$paymentMethodsStore.eTransfer}
								onChange={() => onChange('eTransfer')}
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
										name="input-cash"
										value={$checkoutModalStore.cash === 0 ? '' : $checkoutModalStore.cash}
										onInput={(e) => onInput(e, 'cash')}
										disabled={!$paymentMethodsStore.cash}
										required={$paymentMethodsStore.cash}
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
										name="input-credit-debit"
										value={$checkoutModalStore.creditDebit === 0
											? ''
											: $checkoutModalStore.creditDebit}
										onInput={(e) => onInput(e, 'creditDebit')}
										disabled={!$paymentMethodsStore.creditDebit}
										required={$paymentMethodsStore.creditDebit}
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
										name="input-e-transfer"
										value={$checkoutModalStore.eTransfer === 0 ? '' : $checkoutModalStore.eTransfer}
										onInput={(e) => onInput(e, 'eTransfer')}
										disabled={!$paymentMethodsStore.eTransfer}
										required={$paymentMethodsStore.eTransfer}
									/>
								</div>
							</div>
						</div>

						<div>
							<div class="flex justify-end gap-5">
								<p
									class={`text-2xl font-medium ${missingTotal ? 'text-red-600' : 'text-gray-900'}`}
								>
									Paga con:
								</p>
								<p
									class={`text-3xl font-semibold ${
										missingTotal ? 'text-red-600' : 'text-gray-900'
									}`}
								>
									${$checkoutModalStore.customerPayment}
								</p>
							</div>
							<div class="flex justify-end gap-5">
								<p class="text-3xl font-medium text-gray-900">Su cambio:</p>
								<p class="text-3xl font-semibold text-gray-900">
									${$checkoutModalStore.customerPayment - $selectedTicket.total < 0
										? 0
										: $checkoutModalStore.customerPayment - $selectedTicket.total}
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
									checkedText="Entregado"
									unCheckedText="Sin entregar"
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
					<div class="flex h-full flex-col justify-end gap-5">
						{#if $selectedTicket.status && $selectedTicket.delivered}
							<button
								type="submit"
								class="btn btn-block btn-sm rounded-none"
								disabled={!submitButtonAvailable}>TERMINAR COMPRA</button
							>
						{:else}
							<button
								type="button"
								class="btn-info btn btn-block btn-sm rounded-none"
								on:click={resumeOrder}
								disabled={!submitButtonAvailable}>RESUMIR COMPRA</button
							>
						{/if}
						<button
							type="button"
							on:click={checkoutModal.close()}
							class="btn-error btn btn-block btn-sm rounded-none">CANCELAR</button
						>
					</div>
				</div>
			</div>

			<input
				type="hidden"
				name="change"
				value={$checkoutModalStore.customerPayment - $selectedTicket.total}
			/>
			<input type="hidden" name="customer" value={$selectedTicket.customer.phone} />
			<input type="hidden" name="total" value={$selectedTicket.total} />
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
