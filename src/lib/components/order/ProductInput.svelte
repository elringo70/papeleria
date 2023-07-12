<script>
	import { enhance } from '$app/forms';
	import { getContext } from 'svelte';
	import Swal from 'sweetalert2';

	import { Input } from '$lib/components';

	const tickets = getContext('tickets');

	export let focusInputElement;
	export let bindInputElement;

	async function addProductToTicket({ form, cancel }) {
		if (form.product.value === '') {
			cancel();
			focusInputElement();
		}

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					tickets.addProductToTicket(result.data.product);
					await update();
					focusInputElement();
					break;
				case 'failure':
					Swal.fire({
						icon: 'error',
						title: result.data.message,
						timer: 1250,
						timerProgressBar: true
					});
					break;
			}
		};
	}
</script>

<form action="?/findProduct" method="post" use:enhance={addProductToTicket} autocomplete="off">
	<div class="flex flex-row items-end justify-around pt-3 align-bottom">
		<div class="basis-4/6">
			<Input label="Código" name="product" value={''} bind:bindElement={bindInputElement} />
		</div>
		<div class="basis-1/6 pb-3">
			<button
				type="submit"
				class="w-full rounded bg-indigo-500 py-2 text-white shadow shadow-indigo-500 hover:bg-indigo-600"
				>Agregar</button
			>
		</div>
	</div>
</form>
