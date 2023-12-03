<script>
	export let label = undefined;
	export let name;
	export let placeholder = '';
	export let min = 0;
	export let max = 9999999999;
	export let minlength = 0;
	export let maxlength = 11;
	export let disabled = false;
	export let required = false;
	export let bindElement = null;
	export let placeholderPosition = '';
	export let onChange = () => {};
	export let onKeydown = () => {};
	export let onInput = () => {};

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
		{minlength}
		{maxlength}
		step="any"
		{placeholder}
		bind:this={bindElement}
		class={`focus:outline-nonew-full w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-600 ${placeholderPosition} focus:border-gray-500 focus:outline-none
      ${disabled ? 'cursor-default disabled:bg-gray-200' : ''}
			${errors ? 'border-red-400 focus:border-red-500 focus:outline-none' : ''}`}
		bind:value
		{disabled}
		{required}
		on:change={onChange}
		on:keydown={onKeydown}
		on:input={onInput}
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
