<script>
	import { afterUpdate } from 'svelte';
	import { fade } from 'svelte/transition';

	let showModal = false;
	let modalInput;

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	afterUpdate(() => {
		if (showModal && modalInput) {
			modalInput.focus();
		}
	});
</script>

<button on:click={openModal}>Abrir Modal</button>

{#if showModal}
	<div class="modal-bg" transition:fade>
		<div class="modal" transition:fade>
			<div class="modal-content">
				<h2>Modal</h2>
				<input type="text" bind:this={modalInput} />
				<button on:click={closeModal}>Cerrar</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-bg {
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal {
		background-color: #fefefe;
		padding: 20px;
		border: 1px solid #888;
		width: 80%;
		animation: modalFadeIn 0.3s;
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	input[type='text'] {
		width: 100%;
		padding: 10px;
		font-size: 16px;
		margin-bottom: 10px;
	}

	@keyframes modalFadeIn {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.modal-bg,
	.modal {
		transition: opacity 0.3s;
	}

	.modal-bg-enter {
		opacity: 0;
	}

	.modal-bg-enter-active {
		opacity: 1;
	}

	.modal-bg-exit {
		opacity: 1;
	}

	.modal-bg-exit-active {
		opacity: 0;
	}
</style>
