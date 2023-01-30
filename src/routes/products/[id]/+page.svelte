<script>
	import { enhance } from '$app/forms';

	import { confirmModal } from '$utils/modalButton';

	import { Input, Select, Checkbox, NumberField } from '$lib/components';

	export let form;
	export let data;
	let errors;
	$: errors;

	let loading = false;

	async function updateProduct() {
		const confirmationModal = await Swal.fire({
			icon: 'warning',
			title: '¿Desea actualizar la información del cliente?',
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Eliminar'
		});

		if (confirmModal.isConfirmed) {
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
							title: 'Actualizado'
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
	}

	const submitProduct = ({ form, data }) => {
		loading = true;

		return async ({ result }) => {
			errors = result.data.errors;
			switch (result.type) {
				case 'success':
					const body = Object.fromEntries(data);

					form._id.value = '';
					form.product.value = '';
					form.brand.value = '';
					form.model.value = '';
					form.category.value = '';
					form.cost.value = '';
					form.price.value = '';
					form.wholesale.value = '';
					form.stock.value = '';
					form.stockMinimum.value = '';

					if (!body.requiredStock) {
						isChecked = true;

						stock = '';
						stockMinimum = '';
					}

					confirmModal.fire({
						icon: 'success',
						title: 'Guardado',
						text: 'Producto guardado con éxito'
					});

					break;
				case 'failure':
					confirmModal.fire({
						icon: 'error',
						title: 'Error',
						text: result.data.message
					});
					break;
				case 'error':
					break;
			}
			loading = false;
		};
	};

	//Stock conditional validation
	let stock, stockMinimum, isChecked, category;

	$: category = data?.product?.category ? data?.product?.category : form?.data?.category ?? '';
	$: isChecked = data?.product?.requiredStock ?? form?.product?.requiredStock;
	$: stock = data?.product?.stock.stock
		? data?.product?.stock.stock
		: form?.data?.stock.stock ?? '';
	$: stockMinimum = data?.product?.stock.stockMinimum
		? data?.product?.stock.stockMinimum
		: form?.data?.stock.stockMinimum ?? '';

	const resetStockInputs = () => {
		isChecked = !isChecked;

		stock = '';
		stockMinimum = '';
	};
</script>

<svelte:head>
	<title>Nuevo producto</title>
</svelte:head>

<section class="flex h-[calc(100vh-66px)] items-center justify-center bg-gray-100">
	<div class="container mx-auto w-8/12 rounded bg-white p-5 shadow-lg">
		<div class="mb-7">
			<h3 class="text-2xl font-semibold text-gray-800">Producto nuevo</h3>
			<p class="text-gray-400">Crear un nuevo producto</p>
		</div>
		<form
			action="?/update"
			method="post"
			on:submit|preventDefault={submitProduct}
			autocomplete="off"
		>
			<div class="flex flex-row space-x-4">
				<div class="basis-4/12">
					<Input
						label="Código"
						name="_id"
						required={true}
						value={data?.product?._id ? data?.product?._id : form?.data?._id ?? ''}
						errors={errors?._id}
					/>
				</div>
				<div class="basis-4/12">
					<Input
						label="Producto"
						name="product"
						placeholder="Nombre del producto"
						required={true}
						value={data?.product?.product ? data?.product?.product : form?.data?.product ?? ''}
						errors={errors?.product}
					/>
				</div>
				<div class="basis-4/12">
					<Input
						label="Marca"
						name="brand"
						placeholder="Marca del producto"
						value={data?.product?.brand ? data?.product?.brand : form?.data?.brand ?? ''}
						errors={errors?.brand}
					/>
				</div>
			</div>

			<div class="flex flex-row space-x-4">
				<div class="basis-5/12">
					<Input
						label="Modelo"
						name="model"
						value={data?.product?.model ? data?.product?.model : form?.data?.model ?? ''}
						errors={errors?.model}
					/>
				</div>
				<div class="basis-5/12">
					<Select
						label="Categorias"
						name="category"
						options={data?.categories}
						required={true}
						bind:value={category}
						errors={errors?.category}
					/>
				</div>
			</div>

			<div class="flow-row flex space-x-4">
				<div class="basis-4/12">
					<NumberField
						label="Costo"
						name="cost"
						value={data?.product?.cost ? data?.product?.cost : form?.data?.cost ?? ''}
						errors={errors?.cost}
						required={true}
					/>
				</div>
				<div class="basis-4/12">
					<NumberField
						label="Precio"
						name="price"
						value={data?.product?.price ? data?.product?.price : form?.data?.price ?? ''}
						errors={errors?.price}
						required={true}
					/>
				</div>
				<div class="basis-4/12">
					<NumberField
						label="Precio de mayoreo"
						name="wholesale"
						value={data?.product?.wholesale
							? data?.product?.wholesale
							: form?.data?.wholesale ?? ''}
						errors={errors?.wholesale}
					/>
				</div>
			</div>

			<div class="flex flex-row items-center space-x-4">
				<div class="basis-3/12">
					<NumberField
						label="Cantidad"
						name="stock"
						bind:value={stock}
						errors={errors?.stock}
						disabled={!isChecked}
						required={true}
					/>
				</div>
				<div class="basis-3/12">
					<NumberField
						label="Cantidad mínima"
						name="stockMinimum"
						bind:value={stockMinimum}
						errors={errors?.stockMinimum}
						disabled={!isChecked}
						required={true}
					/>
				</div>
				<div class="basis-4/12">
					<Checkbox
						label="¿Requiere inventario?"
						name="requiredStock"
						bind:checked={isChecked}
						onChange={resetStockInputs}
					/>
				</div>
			</div>

			<div class="flex flex-row">
				<div class="basis-3/12">
					<button
						type="submit"
						class="rounded bg-indigo-700 px-4 py-2 text-white shadow shadow-indigo-700 hover:bg-indigo-600"
						disabled={loading}>Actualizar producto</button
					>
				</div>
			</div>
		</form>
	</div>
</section>
