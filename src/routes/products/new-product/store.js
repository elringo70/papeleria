import { writable } from 'svelte/store';

const initialValues = {
	_id: '',
	product: '',
	model: '',
	brand: '',
	category: '',
	cost: '',
	price: '',
	wholesale: '',
	requiredStock: true,
	stock: '',
	stockMinimum: ''
};

export const product = writable(initialValues);
