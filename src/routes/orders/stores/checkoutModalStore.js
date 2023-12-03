//ts-check
import { writable } from 'svelte/store';

/**
 * @typedef Payment
 * @prop {number} cash
 * @prop {boolean} cashEnable
 * @prop {number} creditDebit
 * @prop {boolean} creditDebitEnable
 * @prop {number} eTransfer
 * @prop {boolean} eTransferEnable
 * @prop {number} total
 * @prop {number} customerPayment
 */

/** @type {Payment} */
const initialValues = {
	cash: 0,
	cashEnable: true,
	creditDebit: 0,
	creditDebitEnable: false,
	eTransfer: 0,
	eTransferEnable: false,
	total: 0,
	customerPayment: 0
};

function createCheckouModalStore() {
	const { subscribe, update, set } = writable(initialValues);

	const setValue = (attribute, value) => {
		console.log(attribute, value);
		update((store) => ({
			...store,
			[attribute]: value
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
		reset
	};
}

export const checkoutModalStore = createCheckouModalStore();
