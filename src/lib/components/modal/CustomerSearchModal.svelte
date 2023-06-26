<script>
	import { afterUpdate } from 'svelte';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	import { NumberField } from '$lib/components';

	export let showCustomerSearchModal = false;
	export let setCustomerTicket;

	const closeModal = () => {
		showCustomerSearchModal = false;
	};

	let inputElement;

	afterUpdate(async () => {
		if (showCustomerSearchModal && inputElement) {
      setTimeout(()=>{

        inputElement.focus();
      }, 300)
		}
	});
</script>

{#if showCustomerSearchModal}
	<div class="modal-bg" transition:fade>
		<div class="modal w-1/3 rounded" transition:fade>
			<div class="mb-2 flex justify-end">
				<div class="text-2xl text-gray-600">
					<button type="button" on:click={closeModal}><Icon icon="material-symbols:close" /></button
					>
				</div>
			</div>

			<div class="max-h-96 overflow-auto">
				<form
					action="?/findCustomer"
					method="post"
					use:enhance={setCustomerTicket}
					autocomplete="off"
				>
					<NumberField name="phone" required={true} bind:bindElement={inputElement} />
					<div class="modal-action">
						<div class="flex w-full justify-around">
							<button
								type="button"
								on:click={closeModal}
								class="rounded bg-gray-700 px-3 py-2 text-center text-white shadow shadow-gray-700 hover:bg-gray-600"
								on>Cancelar</button
							>

							<button
								type="submit"
								class="rounded bg-indigo-700 px-3 py-2 text-center text-white shadow shadow-indigo-700 hover:bg-indigo-600"
								on>Buscar</button
							>
						</div>
					</div>
				</form>
			</div>
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
		animation: modalFadeIn 0.3s;
	}

	@keyframes modalFadeIn {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.modal-bg,
	.modal {
		transition: opacity 0.2s;
	}
</style>
