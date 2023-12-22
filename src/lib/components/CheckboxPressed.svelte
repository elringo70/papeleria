<script>
	import Icon from '@iconify/svelte';

	export let name;
	export let value = '';
	export let unCheckedText = '';
	export let checkedText = '';
	export let checked = false;
	export let unCheckedIcon = 'file-icons:default';
	export let checkedIcon = 'file-icons:default';
	export let onChange = () => {};
</script>

<div class="h-full w-full">
	<input class="hidden" type="checkbox" id={name} {name} {checked} {value} on:change={onChange} />
	<label for={name} class="flex cursor-pointer flex-col border-2 border-gray-400 p-2">
		<div class="flex flex-col items-center justify-center">
			<span class="text-2xl text-gray-500">
				<Icon icon={checked ? checkedIcon : unCheckedIcon} />
			</span>
			<span class="mt-2 select-none text-center text-base text-gray-700">
				{checked ? checkedText : unCheckedText}
			</span>
		</div>
	</label>
</div>

<style>
	input:checked + label {
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		background-color: rgb(14 165 233);
		border-color: rgb(14 165 233);
	}

	input:checked + label span {
		color: white;
	}
</style>
