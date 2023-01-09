<script>
	import { firstUppercase } from '$utils/stringUtils';

	export let name;
	export let label;
	export let options;
	export let disabled = false;
	export let required = false;

	export let value;
	export let errors;
</script>

<div class="form-control w-full mb-3">
	<label class="block text-gray-700 text-sm font-bold mb-2" for={name}>
		{label}
	</label>
	<select
		class={`border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-500 bg-white ${
			errors ? 'border-red-400' : ''
		}`}
		{name}
		id={name}
		{value}
		{disabled}
		{required}
		{...$$restProps}
	>
		<option disabled selected>Seleccione categoría</option>
		{#each options as option}
			<option value={option._id}>{firstUppercase(option.name)}</option>
		{/each}
	</select>
	{#if errors}
		<span class="label-text-alt text-error mt-1">{errors}</span>
	{/if}
</div>
