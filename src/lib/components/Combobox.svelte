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

<div class="w-full mb-3 relative inline-block">
	<input
		{name}
		id={name}
		type="text"
		{placeholder}
		class={`border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-gray-500
			${disabled ? 'disabled:bg-gray-200 cursor-no-drop' : ''}`}
		{disabled}
		{required}
		bind:value
		on:change={onChange}
		on:keyup={onKeyup}
	/>

	{#if list.length > 0}
		<ul class="absolute w-full border rounded mt-1 border-gray-300 divide-y divide-gray-300">
			{#each list as item, i}
				<div transition:slide={{ duration: 150 }}>
					<li
						class="bg-white py-2 px-3 hover:bg-gray-200 cursor-pointer text-sm"
						value={i}
						on:click={onClick}
						on:keydown={() => {}}
					>
						{item.display_name}
					</li>
				</div>
				<!-- {:else}
				<div transition:slide={{ duration: 150 }}>
					<li class="bg-white py-2 px-3 hover:bg-gray-200 cursor-pointer text-sm">
						...No se encontró ninguna dirección
					</li>
				</div> -->
			{/each}
		</ul>
	{/if}
</div>
