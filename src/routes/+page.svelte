<script>
	import { TableModal } from '$lib/components';
	let tableModal = null;

	const openModal = () => {
		tableModal.showModal();
	};
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button
	class="rounded bg-indigo-700 py-2 px-3 text-center text-white shadow shadow-indigo-700 hover:bg-indigo-600"
	on:click={openModal}>Abrir</button
>

<TableModal bind:tableModal />
