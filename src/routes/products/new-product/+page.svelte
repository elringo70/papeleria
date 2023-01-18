<script>
	import { enhance } from '$app/forms';

	import Swal from 'sweetalert2';

	import { Input, Select, Checkbox, NumberField } from '$lib/components';

	export let form;
	export let data;
	let errors;
	$: errors;

	let loading = false;

	const submitProduct = ({ form, data }) => {
		loading = true;

		return async ({ result }) => {
			errors = result.data.errors;
			console.log(result);
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

					Swal.fire({
						icon: 'success',
						title: 'Guardado',
						text: 'Producto guardado con éxito'
					});

					break;
				case 'failure':
					Swal.fire({
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
	<style>
		body {
			height: 100vh;
			background-color: rgb(249 250 251);
		}
	</style>
</svelte:head>

<section class="flex h-[calc(100vh-66px)] justify-center items-center">
	<div class="container w-8/12 mx-auto bg-white p-5 rounded shadow-lg">
		<form action="?/submit" method="post" use:enhance={submitProduct} autocomplete="off">
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
						errors={errors?.category}
					/>
				</div>
			</div>

			<div class="flex flow-row space-x-4">
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

			<div class="flex flex-row space-x-4 items-center">
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
						class="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow shadow-indigo-700"
						disabled={loading}>Guardar</button
					>
				</div>
			</div>
		</form>
	</div>
</section>
