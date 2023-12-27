<script>
	export let label = undefined;
	export let name;
	export let placeholder = '';
	export let disabled = false;
	export let required = false;
	export let accept = '*';
	export let bindElement = null;

	export let onChange = () => {};

	export let value = '';
	export let errors = undefined;
</script>

<div class="form-control w-full">
	{#if label}
		<label class="mb-2 block text-sm font-bold uppercase leading-normal text-gray-600" for={name}>
			{label}
		</label>
	{/if}

	<input
		{name}
		id={name}
		type="file"
		{placeholder}
		class={`w-full rounded-md bg-gray-200 text-gray-900 file:cursor-pointer file:border-none file:bg-gray-700 file:px-3 file:py-2 file:text-white
			${
				disabled
					? 'file:cursor-default file:bg-gray-500 disabled:cursor-default disabled:bg-gray-100 disabled:text-gray-500 file:disabled:text-gray-200'
					: ''
			}
			${errors ? 'border-red-400 focus:border-red-500 focus:outline-none' : ''}`}
		{value}
		{disabled}
		{required}
		{accept}
		bind:this={bindElement}
		on:change={onChange}
	/>
	{#if errors}
		<span class="text-xs italic text-red-500">{errors[0]}</span>
	{/if}
</div>
