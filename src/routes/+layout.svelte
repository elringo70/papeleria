<script>
	export let data;
	export let logoutFromGoogle;

	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar user={data.user} {logoutFromGoogle} />

<slot />
