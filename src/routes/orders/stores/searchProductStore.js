import { writable } from 'svelte/store';

export const selectedProduct = writable(null);

function createSearchProductStore() {
	const { subscribe, set, update } = writable([]);

	const setProducts = (products) => {
		set(products);
	};

	const reset = () => {
		selectedProduct.set(null);
		set([]);
	};

	const selectProduct = (index) => {
		update((store) => {
			selectedProduct.set(index);
			return [...store];
		});
	};

	return {
		subscribe,
		setProducts,
		reset,
		selectProduct
	};
}

export const searchProductStore = createSearchProductStore();
