<script>
	import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';

	import Swal from 'sweetalert2';

	import { Input, Combobox, Checkbox } from '$lib/components';

	import { address, selectedAddress } from './editAddressStore';

	export let form;
	export let data;

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
	let comboValue = '';
	let timer;
	let comboLoading = false;

	let street, number, municipality, city, state, place_id, isChecked;

	$: street = $selectedAddress.street
		? $selectedAddress.street
		: data?.customer.address?.street
		? data?.customer.address?.street
		: form?.data?.street ?? '';
	$: number = $selectedAddress.number
		? $selectedAddress.street
		: data?.customer.address?.number
		? data?.customer.address?.number
		: form?.data?.number ?? '';
	$: municipality = $selectedAddress.municipality
		? $selectedAddress.municipality
		: data?.customer.address?.municipality
		? data?.customer.address?.municipality
		: form?.data?.municipality ?? '';
	$: city = $selectedAddress.city
		? $selectedAddress.city
		: data?.customer.address?.city
		? data?.customer.address?.city
		: form?.data?.city ?? '';
	$: state = $selectedAddress.state
		? $selectedAddress.state
		: data?.customer.address?.state
		? data?.customer.address?.state
		: form?.data?.state ?? '';
	$: place_id = $selectedAddress.place_id
		? $selectedAddress.place_id
		: data?.customer.address?.place_id
		? data?.customer.address?.place_id
		: form?.data?.place_id ?? '';
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

	const resetAddressCheckbox = () => {
		isChecked = !isChecked;

		if (!isChecked) {
			resetAddress();
		} else {
			setAddressBack();
		}
	};

	const resetAddress = () => {
		comboValue = '';
		street = '';
		number = '';
		municipality = '';
		city = '';
		state = '';
		place_id = '';
	};

	const setAddressBack = () => {
		street = data?.customer.address?.street;
		number = data?.customer.address?.number;
		municipality = data?.customer.address?.municipality;
		city = data?.customer.address?.city;
		state = data?.customer.address?.state;
		place_id = data?.customer.address?.place_id;
	};

	const selectAddress = (e) => {
		resetAddress();
		address.selectAddress(e);
	};

	const beforeUnload = () => {
		address.resetAddress();
	};
</script>

<svelte:window on:beforeunload={beforeUnload} />

<svelte:head>
	<title>Editar cliente</title>
</svelte:head>

<section class="flex h-[calc(100vh-66px)] items-center justify-center bg-gray-100">
	<div class="container mx-auto w-9/12 rounded bg-white p-5 shadow-lg">
		<div class="mb-7">
			<h3 class="text-2xl font-semibold text-gray-800">Editar cliente</h3>
			<p class="text-gray-400">Editar la información del cliente</p>
		</div>
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
						value={data?.customer?.phone ? data?.customer?.phone : form?.data?.phone ?? ''}
						errors={errors?.phone}
						readonly={true}
					/>
				</div>
				<div class="basis-3/12">
					<Input
						label="Nombre *"
						name="name"
						required={true}
						value={data?.customer?.name ? data?.customer?.name : form?.data?.name ?? ''}
						errors={errors?.name}
					/>
				</div>
				<div class="basis-3/12">
					<Input
						label="Apellido"
						name="lastName"
						value={data?.customer?.lastName ? data?.customer?.lastName : form?.data?.lastName ?? ''}
						errors={errors?.lastName}
					/>
				</div>
				<div class="basis-3/12">
					<Input
						label="Segundo apellido"
						name="maternalSurname"
						value={data?.customer?.maternalSurname
							? data?.customer?.maternalSurname
							: form?.data?.maternalSurname ?? ''}
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
						onChange={resetAddressCheckbox}
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

			<div class="flex flex-row items-end space-x-4">
				<div class="basis-3/12">
					<Input label="Ciudad" name="city" disabled={true} errors={errors?.city} value={city} />
				</div>
				<div class="basis-4/12">
					<Input label="Estado" name="state" disabled={true} errors={errors?.state} value={state} />
				</div>
				<div class="mb-3 basis-5/12">
					<div class="flex justify-around">
						<button
							type="submit"
							class="rounded bg-indigo-700 px-4 py-2 text-white shadow shadow-indigo-700 hover:bg-indigo-600"
							disabled={loading}>Actualizar cliente</button
						>
						<button
							type="button"
							on:click={setAddressBack}
							class="rounded bg-gray-500 px-4 py-2 text-white shadow shadow-gray-500 hover:bg-gray-600"
							disabled={loading}>Cancelar</button
						>
					</div>
				</div>
			</div>

			<input type="hidden" name="place_id" value={place_id} />
			<input type="hidden" name="street" value={street} />
			<input type="hidden" name="municipality" value={municipality} />
			<input type="hidden" name="city" value={city} />
			<input type="hidden" name="state" value={state} />
		</form>
	</div>
</section>
