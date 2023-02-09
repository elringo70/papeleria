<script>
	import { Input } from '$lib/components';
	export let tableModal;

	const closeModal = () => {
		tableModal.close();
	};
</script>

<dialog bind:this={tableModal} class="rounded shadow-lg">
	<form action="" method="post" class="my-3 mx-5 max-w-2xl">
		<Input label="Buscar producto" />
		<div class="flex justify-end">
			<button
				type="button"
				class="rounded bg-indigo-700 py-2 px-3 text-center text-white shadow shadow-indigo-700 hover:bg-indigo-600"
				on:click={closeModal}>Cerrar</button
			>
		</div>
	</form>
</dialog>

<style>
	::backdrop {
		background-color: rgba(0, 0, 0, 0.55);
	}
</style>
