import { writable } from 'svelte/store';

function createSearchProductStore() {
	const { subscribe, set } = writable([]);

	const setProducts = (products) => {
		set(products);
	};

	const reset = () => {
		set([]);
	};

	return {
		subscribe,
		setProducts,
		reset
	};
}

export const searchProductStore = createSearchProductStore();
