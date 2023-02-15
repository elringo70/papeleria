<script>
	import { firstUppercase } from '$utils/stringUtils';

	export let name;
	export let label;
	export let options;
	export let disabled = false;
	export let required = false;
	export let valueOption;

	export let value;
	export let errors;
</script>

<div class="form-control mb-3 w-full">
	<label class="mb-2 block text-sm font-bold text-gray-700" for={name}>
		{label}
	</label>
	<select
		class={`w-full rounded border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-gray-500 focus:outline-none ${
			errors ? 'border-red-400' : ''
		}`}
		{name}
		id={name}
		bind:value
		{disabled}
		{required}
	>
		<option disabled selected>Seleccione categoría</option>
		{#each options as option}
			<option value={option[valueOption]}>{firstUppercase(option.name)}</option>
		{/each}
	</select>
	{#if errors}
		<span class="label-text-alt mt-1 text-error">{errors}</span>
	{/if}
</div>
