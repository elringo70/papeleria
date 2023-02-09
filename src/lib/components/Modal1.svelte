<script>
	export let form = undefined;
	let myModal;

	function openModal() {
		myModal.showModal();
	}

	function mounted() {
		myModal = this.getRefs().myModal;
	}
</script>

<dialog bind:this={myModal}>
	{#if form}
		<slot name="form" />
	{/if}
	<form method="post" action="your-form-handler-url">
		<!-- Add your form inputs and labels here -->
		<input type="text" name="username" />
		<input type="password" name="password" />
		<!-- Submit button -->
		<button type="submit">Submit</button>
	</form>
</dialog>
