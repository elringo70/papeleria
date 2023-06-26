<script>
	import { page } from '$app/stores';

	export let href = '';
	export let linkName = '';
	let path = '';

	$: path = $page.url.pathname;
</script>

<a
	{href}
	class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
	class:text-white={href === path}
	class:bg-gray-900={href === path}>{linkName}</a
>
