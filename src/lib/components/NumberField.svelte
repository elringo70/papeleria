<script>
	export let label;
	export let name;
	export let placeholder = '';
	export let min = 0;
	export let max = 999999;
	export let step = 1;
	export let disabled = false;
	export let required = false;

	export let value;
	export let errors;
</script>

<div class="form-control w-full mb-3">
	<label class="block text-gray-700 text-sm font-bold mb-2" for={name}>
		{label}
	</label>
	<input
		{name}
		id={name}
		type="number"
		{min}
		{max}
		{step}
		{placeholder}
		class={`border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-500
			${disabled ? 'disabled:bg-gray-200 cursor-no-drop' : ''}
			${errors ? 'border-red-400' : ''}`}
		bind:value
		{disabled}
		{required}
	/>
	{#if errors}
		<span class="text-red-500 text-xs italic">{errors[0]}</span>
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
