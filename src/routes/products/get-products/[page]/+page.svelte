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

	let productModalObject = {
		product: '',
		cost: '',
		wholesale: '',
		price: '',
		stock: ''
	};
	async function getProductDetail(id) {
		try {
			const response = await fetch('/api/products', {
				method: 'post',
				body: JSON.parse(id)
			});

			if (response.ok) {
				productModalObject = {};
				const data = await response.json();

				productModalObject = {
					id: data._id,
					product: data.product,
					brand: data.brand,
					cost: Number(data.cost).toFixed(2),
					price: Number(data.price).toFixed(2),
					wholesale: Number(data.wholesale).toFixed(2),
					stock: data.stock.stock
				};
				openCloseModal();
			}
		} catch (error) {
			console.log(error);
		}
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
								<td class="py-2 px-5 text-center">$ {Number(product.cost).toFixed(2)}</td>
								<td class="py-2 px-5 text-center">$ {Number(product.price).toFixed(2)}</td>
								<td class="py-2 px-5 text-center"
									>{product.wholesale ? '$' + ' ' + Number(product.wholesale).toFixed(2) : ''}</td
								>
								<td class="py-2 px-5 text-center">{product.stock?.stock ?? 'Sin inventario'}</td>
								<td class="py-2 px-5 text-center">
									<div class="flex items-center justify-around">
										<button type="button" on:click={() => getProductDetail(product._id)}>
											<div class="cursor-pointer text-base hover:text-indigo-700">
												<Icon icon="ic:outline-remove-red-eye" />
											</div>
										</button>

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
	<!-- component -->
	<div class="body-font flex w-3/6 overflow-hidden bg-white text-gray-700 lg:w-4/6">
		<div class="container mx-auto px-5 py-5">
			<div class="lg:w-5/5 mx-auto flex flex-wrap">
				<img
					alt="ecommerce"
					class="w-full rounded border border-gray-200 object-cover object-center lg:w-1/2"
					src="https://www.whitmorerarebooks.com/pictures/medium/2465.jpg"
				/>
				<div class="w-full lg:mt-0 lg:w-1/2 lg:pb-6 lg:pl-10">
					<div class="h-1/2">
						<div class="flex items-start">
							<div class="ml-auto text-2xl">
								<button type="button" on:click={openCloseModal}
									><Icon icon="material-symbols:close" /></button
								>
							</div>
						</div>
						<h2 class="title-font text-sm tracking-widest text-gray-500">BRAND NAME</h2>
						<h1 class="title-font mb-1 text-3xl font-medium text-gray-900">
							{productModalObject.product}
						</h1>

						<div>
							<h2 class="title-font text-sm tracking-widest text-gray-500">CATEGORÍA</h2>

							{#if productModalObject.category}
								<span class="title-font text-2xl font-medium text-gray-900">
									{productModalObject.category}
								</span>
							{:else}
								<span class="title-font text-2xl font-medium italic text-gray-400">
									...sin categoría
								</span>
							{/if}
						</div>
					</div>

					<div class="flex h-1/2 items-end border-t-2 border-gray-200 pb-5">
						<div class="flex w-full items-end justify-between">
							<div class="flex-column">
								<div>
									<h2 class="title-font text-sm tracking-widest text-gray-500">COSTO</h2>
									<span class="title-font text-2xl font-medium text-gray-900"
										>$ {productModalObject.cost}</span
									>
								</div>

								<div>
									<h2 class="title-font text-sm tracking-widest text-gray-500">PRECIO</h2>
									<span class="title-font text-2xl font-medium text-gray-900"
										>$ {productModalObject.price}</span
									>
								</div>

								<div>
									<h2 class="title-font text-sm tracking-widest text-gray-500">MAYOREO</h2>
									<span class="title-font text-2xl font-medium text-gray-900"
										>$ {productModalObject.wholesale}</span
									>
								</div>
							</div>

							<div>
								<a
									href="http://127.0.0.1:5173/products/{productModalObject.id}"
									class="ml-auto flex rounded border-0 bg-indigo-500 py-2 px-6 text-white shadow shadow-indigo-500 hover:bg-indigo-600 focus:outline-none"
									>Editar</a
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
