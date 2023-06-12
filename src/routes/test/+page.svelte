<script>
	import { onMount } from 'svelte';
	import Input from '../../lib/components/Input.svelte';

	let bindInput;
	onMount(() => {
		bindInput.focus();
	});
</script>

<div class="w-1/2">
	<form action="" method="post">
		<input
			type="text"
			class="w-full rounded border border-gray-300 py-2 px-3 text-gray-600 focus:border-gray-500 focus:outline-none"
		/>
		<input
			type="text"
			class="w-full rounded border border-gray-300 py-2 px-3 text-gray-600 focus:border-gray-500 focus:outline-none"
		/>
		<Input label="Test" name="test" bind:bindElement={bindInput} />
	</form>
</div>
