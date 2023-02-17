<script>
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components';

	export let action = '';
	export let value = '';
	export let form;
	export let tableModal;
	export let tableHeader = [];
	export let tableRow = [];
	export let onInput = () => {};
	export let onDblClick = () => {};
	export let handleSubmit = () => {};
	export let addProductToTicket = () => {};

	const closeModal = () => {
		value = '';
		tableRow = [];
		tableModal.close();
	};
</script>

<dialog bind:this={tableModal} class="w-2/4 rounded shadow-lg">
	<form
		action="?/findProduct"
		method="post"
		use:enhance={addProductToTicket}
		autocomplete="off"
		bind:this={form}
	>
		<Input label="Buscar producto" {onInput} name="product" bind:value />
	</form>
	<table class="mb-5 w-full min-w-max table-auto">
		<thead>
			<tr class="bg-gray-200 text-sm uppercase leading-normal text-gray-600">
				{#each tableHeader as th}
					<th class="py-3 px-6 text-center">{th}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each tableRow as tr}
				<tr
					class="border-b border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
					data-value={tr._id}
					on:dblclick={onDblClick}
				>
					<td class="py-3 px-6 text-center font-mono text-xs">{tr.product}</td>
					<td class="py-3 px-6 text-center font-mono text-xs">{tr.brand}</td>
					<td class="py-3 px-6 text-center font-mono text-xs">{tr.category}</td>
					<td class="py-3 px-6 text-center font-mono text-xs">$ {tr.price}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="flex justify-end">
		<button
			type="button"
			class="rounded bg-indigo-700 py-2 px-3 text-center text-white shadow shadow-indigo-700 hover:bg-indigo-600"
			on:click={closeModal}>Cerrar</button
		>
	</div>
</dialog>

<style>
	::backdrop {
		background-color: rgba(0, 0, 0, 0.55);
	}

	dialog[open] {
		animation: show 0.3s ease normal;
	}

	@keyframes show {
		from {
			transform: translateY(-200%);
		}
		to {
			transform: translateY(0%);
		}
	}
</style>
