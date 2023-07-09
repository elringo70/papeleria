<script>
	import { page } from '$app/stores';

	export let name;
	export let href = '#';
	export let clickOnNavbarLink = () => {};

	let active = false;
	$: if ($page.url.pathname === href) {
		active = true;
	} else {
		active = false;
	}
</script>

<a
	{href}
	class={`block rounded-md px-3 py-2 text-base font-medium ${
		active ? 'bg-gray-100 text-gray-800' : 'text-gray-500'
	}`}
	aria-current="page"
	on:click={clickOnNavbarLink}>{name}</a
>
