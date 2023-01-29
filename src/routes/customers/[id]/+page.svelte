<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	import Swal from 'sweetalert2';

	import { Input, Combobox, Checkbox } from '$lib/components';

	import { address, selectedAddress } from '../new-customer/addressStore';

	export let form;
	export let data;

	let comboValue = '';
	let errors;
	$: errors;

	let loading = false;

	async function updateCustomer() {
		const confirmationModal = await Swal.fire({
			icon: 'warning',
			title: '¿Desea actualizar la información del cliente?',
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

	//Address lookup
	let timer;
	let comboLoading = false;

	let street, number, municipality, city, state, place_id, isChecked;

	$: street = $selectedAddress.street
		? $selectedAddress.street
		: data?.customer.address?.street ?? '';
	$: number = $selectedAddress.number
		? $selectedAddress.street
		: data?.customer.address?.number ?? '';
	$: municipality = $selectedAddress.municipality
		? $selectedAddress.municipality
		: data?.customer.address?.municipality ?? '';
	$: city = $selectedAddress.municipality
		? $selectedAddress.municipality
		: data?.customer.address?.municipality ?? '';
	$: state = data?.customer?.address
		? data?.customer?.address?.state
		: $selectedAddress.state ?? '';
	$: place_id = data?.customer?.address
		? data?.customer?.address?.place_id
		: $selectedAddress.place_id ?? '';
	$: isChecked = data?.customer?.address ? true : false;

	const holdOnInput = (e) => {
		comboLoading = true;

		clearTimeout(timer);

		const stringInput = e.target.value;

		if (stringInput.length > 3) {
			timer = setTimeout(async () => {
				comboLoading = false;
				await address.fetchAddress(stringInput.trim());
			}, 1000);
		} else if (stringInput.length === 0) {
			comboLoading = false;
			address.resetAddress();
		}
	};

	const resetAddress = () => {
		isChecked = !isChecked;
		comboValue = '';
		street = '';
		number = '';
		municipality = '';
		city = '';
		state = '';
		place_id = '';
	};

	const selectAddress = (e) => {
		street = '';
		number = '';
		municipality = '';
		city = '';
		state = '';
		place_id = '';
		address.selectAddress(e);
	};
</script>

<svelte:head>
	<title>Editar cliente</title>
	<style>
		body {
			background-color: rgb(243 244 246);
		}
	</style>
</svelte:head>

<section class="flex h-[calc(100vh-66px)] items-center justify-center">
	<div class="container mx-auto w-9/12 rounded bg-white p-5 shadow-lg">
		<form
			action="?/submit"
			method="post"
			on:submit|preventDefault={updateCustomer}
			autocomplete="off"
		>
			<input type="hidden" name="id" value={data?.customer?._id} />
			<div class="flex flex-row space-x-4">
				<div class="basis-3/12">
					<Input
						label="Teléfono *"
						name="phone"
						type="tel"
						required={true}
						maxlength={10}
						pattern={'[0-9]{10}'}
						value={data.customer?.phone ?? form?.data?.phone}
						errors={errors?.phone}
						readonly={true}
					/>
				</div>
				<div class="basis-3/12">
					<Input
						label="Nombre *"
						name="name"
						required={true}
						value={data.customer?.name ?? form?.data?.name}
						errors={errors?.name}
					/>
				</div>
				<div class="basis-3/12">
					<Input
						label="Apellido"
						name="lastName"
						value={data.customer?.lastName ?? form?.data?.lastName}
						errors={errors?.lastName}
					/>
				</div>
				<div class="basis-3/12">
					<Input
						label="Segundo apellido"
						name="maternalSurname"
						value={data.customer?.maternalSurname ?? form?.data?.maternalSurname}
						errors={errors?.maternalSurname}
					/>
				</div>
			</div>

			<div class="mb-3 flex flex-row">
				<div class="basis-4/12">
					<Checkbox
						label="¿Dirección?"
						name="requiredAddress"
						bind:checked={isChecked}
						onChange={resetAddress}
					/>
				</div>
			</div>

			<div class="flex flex-row space-x-4">
				<div class="basis-full">
					<Combobox
						name="inputSearch"
						placeholder={isChecked ? 'Buscar dirección' : ''}
						list={$address}
						disabled={!isChecked}
						bind:value={comboValue}
						loading={comboLoading}
						onClick={selectAddress}
						onKeyup={holdOnInput}
					/>
				</div>
			</div>

			<div class="flex flex-row space-x-4">
				<div class="basis-4/12">
					<Input
						label="Calle"
						name="street"
						disabled={true}
						errors={errors?.street}
						value={street}
					/>
				</div>
				<div class="basis-3/12">
					<Input
						label="Número"
						name="number"
						required={true}
						disabled={!isChecked}
						errors={errors?.number}
						value={number}
					/>
				</div>
				<div class="basis-5/12">
					<Input
						label="Colonia"
						name="municipality"
						disabled={true}
						errors={errors?.municipality}
						value={municipality}
					/>
				</div>
			</div>

			<div class="flex flex-row space-x-4">
				<div class="basis-4/12">
					<Input label="Ciudad" name="city" disabled={true} errors={errors?.city} value={city} />
				</div>
				<div class="basis-4/12">
					<Input label="Estado" name="state" disabled={true} errors={errors?.state} value={state} />
				</div>
			</div>

			<input type="hidden" name="place_id" value={place_id} />
			<input type="hidden" name="street" value={street} />
			<input type="hidden" name="municipality" value={municipality} />
			<input type="hidden" name="city" value={city} />
			<input type="hidden" name="state" value={state} />

			<div class="flex flex-row">
				<div class="basis-3/12">
					<button
						type="submit"
						class="rounded bg-indigo-700 px-4 py-2 text-white shadow shadow-indigo-700 hover:bg-indigo-600"
						disabled={loading}>Actualizar</button
					>
				</div>
			</div>
		</form>
	</div>
</section>
