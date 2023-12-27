<script>
	import { enhance } from '$app/forms';

	import Swal from 'sweetalert2/dist/sweetalert2.all.js';

	import { confirmModal } from '$utils/modalButton';

	import { Input, Select, Checkbox, NumberField, InputFile } from '$lib/components';

	export let form;
	export let data;
	let errors;
	$: errors;

	let loading = false;

	const submitProduct = ({ form, data }) => {
		loading = true;

		return async ({ result }) => {
			errors = result?.data?.errors;
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
					form.image.value = '';

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
					Swal.fire({
						icon: 'error',
						title: result.error.message
					});
					break;
			}
			loading = false;
		};
	};

	//Stock conditional validation
	let isChecked = true;

	let stock = form?.data?.stock ?? '';
	let stockMinimum = form?.data?.stockMinimum ?? '';
	$: stock;
	$: stockMinimum;

	const resetStockInputs = () => {
		isChecked = !isChecked;

		stock = '';
		stockMinimum = '';
	};
</script>

<svelte:head>
	<title>Nuevo producto</title>

	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css"
		integrity="sha512-hvNR0F/e2J7zPPfLC9auFe3/SE0yG4aJCOd/qxew74NN7eyiSKjr7xJJMu1Jy2wf7FXITpWS1E/RY8yzuXN7VA=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js"
		integrity="sha512-9KkIqdfN7ipEW6B6k+Aq20PV31bjODg4AA52W+tYtAE0jE0kMx49bjJ3FgvS56wzmyfMUHbQ4Km2b7l9+Y/+Eg=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	></script>
</svelte:head>

<section class="flex h-[calc(100vh-66px)] items-center justify-center bg-gray-100">
	<div class="container mx-auto w-8/12 rounded bg-white p-5 shadow-lg">
		<div class="mb-7">
			<h3 class="text-2xl font-semibold text-gray-800">Producto nuevo</h3>
			<p class="text-gray-400">Crear un nuevo producto</p>
		</div>
		<form
			action="?/submit"
			method="post"
			use:enhance={submitProduct}
			autocomplete="off"
			enctype="multipart/form-data"
		>
			<div class="flex flex-row space-x-4">
				<div class="basis-4/12">
					<Input
						label="Código"
						name="_id"
						required={true}
						value={form?.data?._id ?? ''}
						errors={errors?._id}
					/>
				</div>
				<div class="basis-4/12">
					<Input
						label="Producto"
						name="product"
						placeholder="Nombre del producto"
						required={true}
						value={form?.data?.product ?? ''}
						errors={errors?.product}
					/>
				</div>
				<div class="basis-4/12">
					<Input
						label="Marca"
						name="brand"
						placeholder="Marca del producto"
						value={form?.data?.brand ?? ''}
						errors={errors?.brand}
					/>
				</div>
			</div>

			<div class="flex flex-row space-x-4">
				<div class="basis-5/12">
					<Input
						label="Modelo"
						name="model"
						value={form?.data?.model ?? ''}
						errors={errors?.model}
					/>
				</div>
				<div class="basis-5/12">
					<Select
						label="Categorias"
						name="category"
						options={data?.categories}
						required={true}
						value={form?.data?.category ?? ''}
						valueOption="_id"
						errors={errors?.category}
					/>
				</div>
			</div>

			<div class="flow-row flex space-x-4">
				<div class="basis-4/12">
					<NumberField
						label="Costo"
						name="cost"
						value={form?.data?.cost}
						errors={errors?.cost}
						required={true}
					/>
				</div>
				<div class="basis-4/12">
					<NumberField
						label="Precio"
						name="price"
						value={form?.data?.price}
						errors={errors?.price}
						required={true}
					/>
				</div>
				<div class="basis-4/12">
					<NumberField
						label="Precio de mayoreo"
						name="wholesale"
						value={form?.data?.wholesale}
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
