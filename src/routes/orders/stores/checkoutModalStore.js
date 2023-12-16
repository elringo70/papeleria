import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';

/**
 * @typedef Payment
 * @prop {number} cash
 * @prop {number} creditDebit
 * @prop {number} eTransfer
 * @prop {number} total
 * @prop {number} customerPayment
 */

/** @type {Payment} */
const initialValues = {
	cash: 0,
	creditDebit: 0,
	eTransfer: 0,
	total: 0,
	customerPayment: 0
};

const checkoutModalStorage = writable(
	(browser && JSON.parse(localStorage.getItem('checkoutModal'))) || initialValues
);

checkoutModalStorage.subscribe(
	(values) => browser && localStorage.setItem('checkoutModalStorage', JSON.stringify(values))
);

function createCheckouModalStore() {
	const { subscribe, update, set } = writable(get(checkoutModalStorage));

	const setValue = (attribute, value) => {
		update((store) => ({
			...store,
			[attribute]: Number(value)
		}));

		calculateTotal();
	};

	const calculateTotal = () => {
		update((store) => ({
			...store,
			customerPayment: store.cash + store.creditDebit + store.eTransfer
		}));
	};

	const reset = () => {
		set(initialValues);
	};

	return {
		subscribe,
		setValue,
		calculateTotal,
		reset
	};
}

export const checkoutModalStore = createCheckouModalStore();

checkoutModalStore.subscribe(
	(values) => browser && localStorage.setItem('checkoutModalStorage', JSON.stringify(values))
);
