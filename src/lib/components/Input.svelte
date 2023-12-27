<script>
	export let label = undefined;
	export let name;
	export let type = 'text';
	export let placeholder = '';
	export let disabled = false;
	export let required = false;
	export let readonly = false;
	export let maxlength = 100;
	export let minlength = 0;
	export let pattern = null;
	export let bindElement = null;
	export let width = 'w-full';
	export let tabindex = '';

	export let onChange = () => {};
	export let onKeyup = () => {};
	export let onInput = () => {};

	export let value = '';
	export let errors = undefined;
</script>

<div class="form-control mb-3 {width}">
	{#if label}
		<label class="mb-2 block text-sm font-bold uppercase leading-normal text-gray-600" for={name}>
			{label}
		</label>
	{/if}

	<input
		{name}
		id={name}
		{type}
		{placeholder}
		class={`w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-600 focus:border-gray-500 focus:outline-none
			${disabled ? 'cursor-default disabled:bg-gray-200' : ''}
			${errors ? 'border-red-400 focus:border-red-500 focus:outline-none' : ''}
			${
				readonly
					? 'readonly:border-gray-500 cursor-default bg-gray-200 text-gray-500 focus:outline-none'
					: ''
			}`}
		{value}
		{disabled}
		{required}
		{readonly}
		{maxlength}
		{minlength}
		{pattern}
		{tabindex}
		bind:this={bindElement}
		on:change={onChange}
		on:keyup={onKeyup}
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
