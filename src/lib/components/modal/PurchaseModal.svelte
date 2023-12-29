<script>
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { Input } from '$lib/components';
	import { onDestroy } from 'svelte';

	export let purchaseModal = false;

	const closePurchaseModal = () => {
		purchaseModal = false;
	};

	export let Form;

	let errors;
	$: errors;

	const submitOrder = () => {
		return async ({ result }) => {
			errors = result?.data?.errors;
			switch (result.type) {
				case 'success':
					console.log(result);
					break;
			}
		};
	};

	onDestroy(() => {
		console.log('destroy');
	});
</script>

{#if purchaseModal}
	<div
		class="modal-bg flex flex-col rounded-md bg-white px-7 pb-7 pt-3 shadow-lg"
		transition:fade
		aria-hidden="true"
	>
		<div class="modal rounded" transition:fade>
			<div class="mb-3">
				<span class="text-2xl font-bold text-gray-600"> Método de pago </span>
			</div>
			<form action="?/submitOrder" use:enhance={submitOrder} autocomplete="off" method="post">
				<div class="grid w-full max-w-screen-sm grid-cols-3 gap-2">
					<div>
						<input class="hidden" type="radio" id="cash-payment" name="payment-method" checked />
						<label
							for="cash-payment"
							class="flex cursor-pointer flex-col border-2 border-gray-400 p-4"
						>
							<div class="flex flex-col items-center justify-center">
								<span class="text-4xl text-gray-500">
									<Icon icon="mdi:cash" />
								</span>
								<span class="mt-2 text-center text-xl font-bold text-gray-700">Efectivo</span>
							</div>
						</label>
					</div>
					<div>
						<input class="hidden" type="radio" id="credit-debit" name="payment-method" />
						<label
							for="credit-debit"
							class="flex cursor-pointer flex-col border-2 border-gray-400 p-4"
						>
							<div class="flex flex-col items-center justify-center">
								<span class="text-4xl text-gray-500">
									<Icon icon="majesticons:creditcard" />
								</span>
								<span class="mt-2 text-center text-xl font-bold text-gray-700"
									>Crédito o débito</span
								>
							</div>
						</label>
					</div>
					<div>
						<input class="hidden" type="radio" id="transfer-payment" name="payment-method" />
						<label
							for="transfer-payment"
							class="flex cursor-pointer flex-col border-2 border-gray-400 p-4"
						>
							<div class="flex flex-col items-center justify-center">
								<span class="text-4xl text-gray-500">
									<Icon icon="solar:card-transfer-bold" />
								</span>
								<span class="mt-2 text-center text-xl font-bold text-gray-700">Transferencia</span>
							</div>
						</label>
					</div>
				</div>

				<div class="my-5">Costo</div>

				<div class="w-12/12 container">
					<div class="flex flex-row">
						<div class="flex w-6/12 flex-col justify-between p-5 pl-0">
							<Input
								name="cash"
								value={Form?.data?._id ?? ''}
								errors={errors?._id}
								placeholder="Efectivo"
							/>
							<Input
								name="terminal"
								value={Form?.data?.product ?? ''}
								errors={errors?.product}
								placeholder="Terminal"
							/>
							<Input
								name="vouchers"
								value={Form?.data?.brand ?? ''}
								errors={errors?.brand}
								placeholder="Vales"
							/>
							<Input
								name="transfer"
								value={Form?.data?.brand ?? ''}
								errors={errors?.brand}
								placeholder="Transferencia"
							/>
						</div>

						<div class="flex w-6/12 flex-col justify-between p-5 pr-0">
							<button
								type="submit"
								class="w-full rounded bg-blue-600 px-3 py-2 text-white shadow shadow-blue-600 hover:bg-blue-500"
								>Cobrar</button
							>
							<button
								type="submit"
								class="w-full rounded bg-indigo-700 px-3 py-2 text-white shadow shadow-indigo-700 hover:bg-indigo-600"
								>Cobrar e imprimir</button
							>
							<button
								type="button"
								on:click={closePurchaseModal}
								class="w-full rounded bg-red-600 px-3 py-2 text-white shadow shadow-red-600 hover:bg-red-500"
								>Cancelar</button
							>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.modal-bg {
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal {
		background-color: #fefefe;
		padding: 20px;
		border: 1px solid #888;
	}

	input:checked + label {
		border-color: black;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	input:checked + label span {
		color: rgb(22 163 74);
	}
</style>
