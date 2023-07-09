<script>
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	export let linkName = '';
	export let submenuLinks = [];

	let active = false;
	let path = '';
	$: path = $page.url.pathname;

	let pathExists = false;
	$: pathExists = submenuLinks.some((obj) => path.startsWith(obj.href));

	$: if (pathExists) {
		active = true;
	} else {
		active = false;
	}
</script>

<div class="group relative">
	<button
		class={`flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-500 ${
			active ? 'bg-gray-100 text-gray-800' : 'text-gray-500'
		}`}
	>
		{linkName}<Icon icon="mdi:chevron-down" />
	</button>

	<div
		class="absolute left-0 z-10 hidden w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none group-hover:block"
	>
		{#each submenuLinks as link}
			<a
				href={link.href}
				class={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
					path.includes(link.href) ? 'font-semibold' : ''
				}`}>{link.name}</a
			>
		{/each}
	</div>
</div>
