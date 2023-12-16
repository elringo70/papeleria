import { writable } from 'svelte/store';

const initialValues = {
	cash: true,
	creditDebit: false,
	eTransfer: false
};

function createPaymentMethodsStore() {
	const { subscribe, update, set } = writable(initialValues);

	const setValue = (attrubite) => {
		update((store) => ({
			...store,
			[attrubite]: !store[attrubite]
		}));
	};

	const reset = () => {
		set(initialValues);
	};

	return {
		subscribe,
		setValue,
		reset
	};
}

export const paymentMethodsStore = createPaymentMethodsStore();
