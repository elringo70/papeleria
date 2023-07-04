<script>
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	export let linkName = '';
	export let bindElement = null;
	export let submenuLinks = [];
	export let isOpen = false;
	export let clickOnNavbarLink = () => {};

	let path = '';

	$: path = $page.url.pathname;
</script>

<div class="relative ml-3">
	<div>
		<button
			class="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-700"
			on:click={clickOnNavbarLink}
			bind:this={bindElement}
			>{linkName} <span class="ml-1"><Icon icon="mdi:arrow-down-drop" /></span></button
		>
	</div>
	{#if isOpen}
		<div
			class="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="user-menu-button"
			tabindex="-1"
			transition:slide={{ duration: 200 }}
		>
			<!-- Active: "bg-gray-100", Not Active: "" -->
			{#each submenuLinks as link}
				<a
					href={link.href}
					class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
					role="menuitem"
					tabindex="-1"
					id="user-menu-item-0">{link.name}</a
				>
			{/each}
		</div>
	{/if}
</div>
