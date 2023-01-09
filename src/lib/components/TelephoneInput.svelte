<script>
	export let label;
	export let name;
	export let placeholder = '';
	export let disabled = false;
	export let required = false;
	export let readonly = false;
	export let maxlength = 100;
	export let minlength = 0;

	export let onChange = () => {};
	export let onKeyup = () => {};

	export let value = '';
	export let errors;
</script>

<div class="form-control w-full mb-3">
	<label class="block text-gray-700 text-sm font-bold mb-2" for={name}>
		{label}
	</label>
	<input
		{name}
		id={name}
		type="tel"
		{placeholder}
		class={`border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-500
			${disabled ? 'disabled:bg-gray-200 cursor-no-drop' : ''}
			${errors ? 'border-red-400 focus:outline-none focus:border-red-500' : ''}`}
		{value}
		{disabled}
		{required}
		{readonly}
		{maxlength}
		{minlength}
		on:change={onChange}
		on:keyup={onKeyup}
	/>
	{#if errors}
		<span class="text-red-500 text-xs italic">{errors[0]}</span>
	{/if}
</div>
