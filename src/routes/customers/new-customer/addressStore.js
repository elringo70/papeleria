import { writable, get } from 'svelte/store';

const initialValuesSelectedAddress = {
	street: '',
	municipality: '',
	city: '',
	state: '',
	place_id: ''
};

export const selectedAddress = writable({});

function addressStore() {
	const { subscribe, set, update } = writable([]);

	const fetchAddress = async (string) => {
		let url = `https://nominatim.openstreetmap.org/?addressdetails=1&q=${string}&format=json&limit=5`;

		if (string !== '') {
			try {
				const response = await fetch(url);
				const data = await response.json();
				set(data);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const selectAddress = (e) => {
		const index = e.target.value;

		const addresses = get(address);
		const findAddress = addresses[index];

		selectedAddress.set({
			street: findAddress.address.road,
			municipality: findAddress.address.residential,
			city: findAddress.address.city ?? findAddress.address.county,
			state: findAddress.address.state,
			place_id: findAddress.place_id
		});

		set([]);
	};

	const resetAddress = () => {
		set([]);
		selectedAddress.set(initialValuesSelectedAddress);
	};

	return {
		subscribe,
		fetchAddress,
		selectAddress,
		resetAddress
	};
}

export const address = addressStore();
