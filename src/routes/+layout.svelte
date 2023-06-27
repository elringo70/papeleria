<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';

	import { onAuthStateChanged } from 'firebase/auth';
	import { auth } from '../utils/firebase';

	export let data;

	import '../app.css';
	//import Navbar from '$lib/components/Navbar.svelte';
	import Navbar from '$lib/components/Navbar/Navbar.svelte';

	onMount(() => {
		if (browser) {
			const unsubscribe = onAuthStateChanged(auth, () => invalidateAll());
			return unsubscribe();
		}
	});
</script>

<Navbar />

<slot />
