<script>
	export let data;

	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar user={data?.user} />

<slot />
