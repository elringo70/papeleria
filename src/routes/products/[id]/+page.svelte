<script>
	import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize, enhance } from '$app/forms';

	import Swal from 'sweetalert2/dist/sweetalert2.all.js';

	import { confirmModal } from '$utils/modalButton';

	import { Input, Select, Checkbox, NumberField, InputFile } from '$lib/components';

	export let form;
	export let data;
	let errors;
	$: errors;

	let loading = false;

	const submitProduct = ({ data }) => {
		loading = true;

		return async ({ result }) => {
			errors = result?.data?.errors;
			switch (result.type) {
				case 'success':
					const body = Object.fromEntries(data);

					if (!body.requiredStock) {
						isChecked = true;

						stock = '';
						stockMinimum = '';
					}

					Swal.fire({
						icon: 'success',
						title: 'Guardado',
						text: 'Producto guardado con éxito'
					});

					break;
				case 'error':
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Error en el servidor'
					});
					break;
			}
			loading = false;
		};
	};

	let category = data?.product?.category ? data?.product?.category : form?.data?.category;
	$: category;

	//Stock conditional validation
	let stock = data?.product?.stock.stock
		? data?.product?.stock.stock
		: form?.data?.stock.stock ?? '';
	let stockMinimum = data?.product?.stock.stockMinimum
		? data?.product?.stock.stockMinimum
		: form?.data?.stock.stockMinimum ?? '';
	let isChecked = data?.product?.requiredStock ?? form?.product?.requiredStock;
	$: isChecked;
	$: stock;
	$: stockMinimum;

	const resetStockInputs = () => {
		isChecked = !isChecked;

		stock = '';
		stockMinimum = '';

		if (!isChecked) {
			stock = '';
			stockMinimum = '';
		} else {
			stock = data?.product?.stock.stock;
			stockMinimum = data?.product?.stock.stockMinimum;
		}
	};
</script>

<svelte:head>
	<title>Nuevo producto</title>
</svelte:head>

<section class="flex h-[calc(100vh-66px)] items-center justify-center bg-gray-100">
	<div class="container mx-auto w-8/12 rounded bg-white p-5 shadow-lg">
		<div class="mb-7">
			<h3 class="text-2xl font-semibold text-gray-800">Editar producto</h3>
			<p class="text-gray-400">Actualizar la información del producto</p>
		</div>
		<form action="?/update" method="post" use:enhance={submitProduct} autocomplete="off">
			<input type="hidden" name="id" value={data?.product?._id} />
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
						value={data?.product?.category
							? data?.product?.category
							: form?.product?.category ?? ''}
						valueOption="name"
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

			<div class="flex flex-row items-end justify-between space-x-4">
				<div class="basis-2/3">
					<InputFile
						label="Imagen"
						name="image"
						accept="image/jpg, image/jpeg, image/png, image/webp"
					/>
				</div>

				<div class="flex basis-1/3">
					<button
						type="submit"
						class="w-full rounded bg-indigo-700 px-4 py-2 text-white shadow shadow-indigo-700 hover:bg-indigo-600"
						disabled={loading}>Guardar</button
					>
				</div>
			</div>
		</form>
	</div>
</section>
