import { writable } from 'svelte/store';

function createModalsStore() {
	const { subscribe, set } = writable([]);

	const setModals = (modals) => {
		set(modals);
	};

	return {
		subscribe,
		setModals
	};
}

export const modalsStore = createModalsStore();
