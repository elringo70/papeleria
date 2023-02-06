<script>
	export let label = undefined;
	export let name;
	export let placeholder = '';
	export let min = 0;
	export let max = 9999999999;
	export let disabled = false;
	export let required = false;

	export let value = '';
	export let errors = undefined;
</script>

<div class="form-control mb-3 w-full">
	{#if label}
		<label class="mb-2 block text-sm font-bold uppercase leading-normal text-gray-600" for={name}>
			{label}
		</label>
	{/if}
	<input
		{name}
		id={name}
		type="number"
		{min}
		{max}
		step="any"
		{placeholder}
		class={`w-full rounded border border-gray-300 py-2 px-3 text-gray-700 focus:border-gray-500 focus:outline-none
			${disabled ? 'cursor-no-drop disabled:bg-gray-200' : ''}
			${errors ? 'border-red-400' : ''}`}
		bind:value
		{disabled}
		{required}
	/>
	{#if errors}
		<span class="text-xs italic text-red-500">{errors[0]}</span>
	{/if}
</div>

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
