<script>
	import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	import { firstUppercase } from '$utils/stringUtils';

	import Swal from 'sweetalert2';
	import Icon from '@iconify/svelte';

	export let data;

	async function deleteProduct() {
		const confirmationModal = await Swal.fire({
			icon: 'warning',
			title: '¿Desea eliminar el producto?',
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Eliminar'
		});

		if (confirmationModal.isConfirmed) {
			const data = new FormData(this);

			const response = await fetch(this.action, {
				method: 'POST',
				body: data
			});

			const result = deserialize(await response.text());

			switch (result.type) {
				case 'success':
					Swal.fire({
						icon: 'success',
						title: 'Eliminado'
					});

					await invalidateAll();

					break;
				case 'failure':
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: result.data.message
					});
					break;
			}
			applyAction(result);
		}
	}
</script>

<div class="overflow-x-auto">
	<div class="min-w-screen min-h-screen bg-gray-100 flex justify-center font-sans overflow-hidden">
		<div class="w-full lg:w-5/6">
			<div class="bg-white shadow-lg rounded my-6">
				<table class="min-w-max w-full table-auto">
					<thead>
						<tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
							<th class="py-3 px-6 text-left">Producto</th>
							<th class="py-3 px-6 text-left">Marca</th>
							<th class="py-3 px-6 text-left">Categoría</th>
							<th class="py-3 px-6 text-center">Costo</th>
							<th class="py-3 px-6 text-center">Precio</th>
							<th class="py-3 px-6 text-center">Precio de mayoreo</th>
							<th class="py-3 px-6 text-center">Inventario</th>
							<th class="py-3 px-6 text-center">Acciones</th>
						</tr>
					</thead>
					<tbody class="text-gray-600 text-sm font-light">
						{#each data.products as product}
							<tr class="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
								<td class="py-2 px-5 text-left">
									<div class="flex items-center">
										<span class="font-medium">{firstUppercase(product.product)}</span>
									</div>
								</td>
								<td class="py-2 px-5 text-left">
									<div class="flex items-center">
										<span>{firstUppercase(product.brand)}</span>
									</div>
								</td>
								<td class="py-2 px-5 text-center">
									<div class="flex items-center justify-center">
										{firstUppercase(product.category)}
									</div>
								</td>
								<td class="py-2 px-5 text-center">$ {product.cost}</td>
								<td class="py-2 px-5 text-center">$ {product.price}</td>
								<td class="py-2 px-5 text-center">{product.wholesale ?? 'Sin inventario'}</td>
								<td class="py-2 px-5 text-center">{product.stock?.stock ?? 'Sin inventario'}</td>
								<td class="py-2 px-5 text-center">
									<div class="flex item-center justify-center">
										<div class="mr-2 hover:text-indigo-700 cursor-pointer text-base">
											<Icon icon="mdi:pencil" />
										</div>

										<form action="?/delete" method="POST" on:submit|preventDefault={deleteProduct}>
											<input type="hidden" name="id" value={product._id} />
											<button>
												<div class="mr-2 hover:text-red-700 cursor-pointer text-base">
													<Icon icon="uil:trash-alt" />
												</div>
											</button>
										</form>
									</div>
								</td>
							</tr>
						{:else}
							<td class="py-3 text-center" colspan="8"> ...Sin productos </td>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
