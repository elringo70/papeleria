<script>
	export let name;
	export let href = '#';
	export let clickOnNavbarLink = () => {};
</script>

<a
	{href}
	class="block rounded-md px-3 py-2 text-base font-medium text-gray-700"
	aria-current="page"
	on:click={clickOnNavbarLink}>{name}</a
>
