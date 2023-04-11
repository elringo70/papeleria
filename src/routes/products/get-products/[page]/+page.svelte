<script>
	import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';
	import { page } from '$app/stores';

	import { Pagination } from '$lib/components';

	import { firstUppercase } from '$utils/stringUtils';

	import Swal from 'sweetalert2/dist/sweetalert2.all.js';
	import Icon from '@iconify/svelte';

	export let data;
	let modalOpen = false;

	$: totalPages = Math.ceil(data.pagination.count / data.pagination.limit);
	$: currentPage = Number($page.params.page) || 1;

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

	const openCloseModal = () => {
		modalOpen = !modalOpen;
	};

	async function getProductDetail() {
		const data = new FormData(this);

		const response = await fetch(this.action, {
			method: 'POST',
			body: data
		});

		console.log(response);

		const result = deserialize(await response.text());

		switch (result.type) {
			case 'success':
				console.log('first');

				break;
		}
		applyAction(result);

		openCloseModal();
	}
</script>

<div class="flex justify-center bg-gray-100 py-5 font-sans">
	<div class="basis-5/6">
		<div class="flex-col justify-center">
			<div class="rounded bg-white shadow-lg">
				<table class="w-full min-w-max table-auto">
					<thead>
						<tr class="bg-gray-200 text-sm uppercase leading-normal text-gray-600">
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
					<tbody class="text-sm font-light text-gray-600">
						{#each data.products as product}
							<tr class="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
								<td class="py-2 px-5 text-left">
									<div class="flex items-center">
										<span class="font-medium">{product.product}</span>
									</div>
								</td>
								<td class="py-2 px-5 text-left">
									<div class="flex items-center">
										<span>{product.brand}</span>
									</div>
								</td>
								<td class="py-2 px-5 text-center">
									<div class="flex items-center justify-center">
										{product.category}
									</div>
								</td>
								<td class="py-2 px-5 text-center">$ {product.cost}</td>
								<td class="py-2 px-5 text-center">$ {product.price}</td>
								<td class="py-2 px-5 text-center">{product.wholesale ?? 'Sin inventario'}</td>
								<td class="py-2 px-5 text-center">{product.stock?.stock ?? 'Sin inventario'}</td>
								<td class="py-2 px-5 text-center">
									<div class="flex items-center justify-around">
										<form
											action="?/getProductDetail"
											method="post"
											class="m-0 inline p-0"
											on:submit|preventDefault={getProductDetail}
										>
											<input type="hidden" name="id" value={product._id} />
											<button type="submit">
												<div class="cursor-pointer text-base hover:text-indigo-700">
													<Icon icon="ic:outline-remove-red-eye" />
												</div>
											</button>
										</form>
										<a href="/products/{product._id}">
											<input type="hidden" name="id" value={product._id} />
											<div class="cursor-pointer text-base hover:text-indigo-700">
												<Icon icon="mdi:pencil" />
											</div>
										</a>

										<form
											action="?/delete"
											method="post"
											class="m-0 inline p-0"
											on:submit|preventDefault={deleteProduct}
										>
											<input type="hidden" name="id" value={product._id} />
											<button>
												<div class="cursor-pointer text-base hover:text-red-700">
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
			<div class="pt-5">
				<Pagination {currentPage} {totalPages} />
			</div>
		</div>
	</div>
</div>

<div class="modal {modalOpen ? 'modal-open' : ''}" id="my-modal-2">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Congratulations random Internet user!</h3>
		<p class="py-4">
			You've been selected for a chance to get one year of subscription to use Wikipedia for free!
		</p>
		<div class="modal-action">
			<button class="btn" on:click={openCloseModal}>Yay!</button>
		</div>
	</div>
</div>
