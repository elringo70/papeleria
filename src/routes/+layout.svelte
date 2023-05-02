<script>
	import { writable } from 'svelte/store';
	export let data;

	const user = writable();
	$: user.set(data.user);

	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar user={$user} />

<slot />
