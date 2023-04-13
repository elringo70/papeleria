<script>
	import { slide } from 'svelte/transition';

	export let name;
	export let placeholder = '';
	export let disabled = false;
	export let required = false;
	export let limit = 5;
	export let loading;
	export let value;

	export let list = [];

	export let onChange = () => {};
	export let onKeyup = () => {};
	export let onClick = () => {};
</script>

<div class="relative mb-3 inline-block w-full">
	<input
		{name}
		id={name}
		type="text"
		{placeholder}
		class={`w-full rounded border border-gray-300 py-2 px-3 text-gray-700 focus:border-gray-500 focus:outline-none
			${disabled ? 'cursor-default disabled:bg-gray-200' : ''}`}
		{disabled}
		{required}
		bind:value
		on:change={onChange}
		on:keyup={onKeyup}
	/>

	{#if list.length > 0}
		<ul class="absolute mt-1 w-full divide-y divide-gray-300 rounded border border-gray-300">
			{#if loading}
				<li class="cursor-pointer bg-white py-2 px-3 text-sm hover:bg-gray-200">...</li>
			{:else}
				{#each list as item, i}
					<div transition:slide={{ duration: 150 }}>
						<li
							class="cursor-pointer bg-white py-2 px-3 text-sm hover:bg-gray-200"
							value={i}
							on:click={onClick}
							on:keydown={onKeyup}
						>
							{item.display_name}
						</li>
					</div>
				{/each}
			{/if}
		</ul>
	{/if}
</div>
