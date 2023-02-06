<script>
	export let open = false;

	export let title = '';
	export let subtitle = '';
	export let saveButton = () => {};
	export let cancelButton = undefined;
	export let form = true;

	const saveFunction = () => {
		saveButton();
		closeModal();
	};

	const closeModal = () => {
		open = false;
	};
</script>

<div class="modal" class:modal-open={open}>
	<div class="modal-box">
		<h3 class="text-2xl font-semibold text-gray-800">{title}</h3>
		<p class="text-gray-400">{subtitle}</p>

		<slot name="content"><div /></slot>
		{#if form}
			<slot name="form" />
		{:else}
			<div class="modal-action">
				<div class="flex w-full justify-around">
					{#if cancelButton}
						<button
							type="button"
							class="w-full rounded bg-gray-700 py-2 px-3 text-center text-white shadow shadow-gray-700 hover:bg-gray-600"
							on:click={closeModal}
							on>Cancelar</button
						>
					{/if}
					<button
						type="button"
						class="w-full rounded bg-indigo-700 py-2 px-3 text-center text-white shadow shadow-indigo-700 hover:bg-indigo-600"
						on:click={saveFunction}
						on>Entendido</button
					>
				</div>
			</div>
		{/if}
	</div>
</div>
