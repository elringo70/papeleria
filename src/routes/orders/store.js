import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';

const initialValues = [
	{
		customer: {},
		products: [],
		total: 0,
		selectedTicket: true,
		/*
			open: open for adding products and customer name
			pending: pending for customer instructions or to be paid
			closed: paid and pending delivery or be delivered
		*/
		status: 'open',
		/*
			pending: pending to be delivered
			delivered: order delivered
		*/
		devivered: 'pending'
	}
];

/* 
	Selected ticket to be able to get information from each ticket and 
	displayed Ticket Detail and Ticket Resume
*/
export const selectedTicket = writable(initialValues[0]);

/*
	Ticket storage is necessary to get information from local storage
	in case on page been refreshed
*/
const ticketStorage = writable(
	(browser && JSON.parse(localStorage.getItem('tickets'))) || initialValues
);

ticketStorage.subscribe(
	(values) => browser && localStorage.setItem('tickets', JSON.stringify(values))
);

/* Tickets store and functions */
function ticketStore() {
	const { subscribe, set, update } = writable(get(ticketStorage));

	const onLoad = () => {
		const tickets = get(ticketStorage);
		const ticketPosition = tickets.findIndex((ticket) => ticket.selectedTicket === true);
		selectedTicket.set(tickets[ticketPosition]);
	};

	const findProduct = async (product) => {
		const formData = new FormData();

		for (let field of product) {
			const [key, value] = field;
			formData.append(key, value);
		}

		try {
			const response = await fetch('/orders?/findProduct', {
				method: 'POST',
				body: formData
			});
			const data = await response.json();
			return data;
		} catch (error) {
			return error;
		}
	};

	const totalCalculation = (tickets, ticketPosition) => {
		let total = 0;
		for (let i = 0; i < tickets[ticketPosition].products.length; i++) {
			total +=
				tickets[ticketPosition].products[i].quantity *
				tickets[ticketPosition].products[i].product.price;
		}

		return total;
	};

	const postOrder = async (order) => {
		const formData = new FormData();

		console.log(order);
		formData.append('customer', order.customer);
		formData.append('products', order.products);

		try {
			const response = await fetch('/orders?/postOrder', {
				method: 'POST',
				body: formData
			});
			const data = await response.json();
			return data;
		} catch (error) {
			return error;
		}
	};

	const addTicket = () => {
		update((tickets) => {
			tickets = [
				...tickets,
				{
					customer: {},
					products: [],
					total: 0,
					selectedTicket: false,
					status: 'open',
					devivered: 'pending'
				}
			];

			ticketStorage.set(tickets);

			return [...tickets];
		});
	};

	const removeTicket = (ticketIndex) => {
		update((tickets) => {
			if (tickets.length > 1) {
				tickets = tickets.filter((ticket, index) => index !== parseInt(ticketIndex, 10));
			}
			selectedTicket.set(tickets[0]);

			for (let i = 0; i < tickets.length; i++) {
				tickets[i].selectedTicket = false;
			}

			ticketStorage.set((tickets[0].selectedTicket = true));
			return [...tickets];
		});
	};

	const addProductToTicket = async (product) => {
		update((tickets) => {
			const ticketPosition = tickets.findIndex((ticket) => ticket.selectedTicket === true);

			for (let i = 0; i < tickets[ticketPosition].products.length; i++) {
				if (tickets[ticketPosition].products[i].product._id === product._id) {
					tickets[ticketPosition].products[i].quantity++;
					tickets[ticketPosition].total = totalCalculation(tickets, ticketPosition);
					selectedTicket.set(tickets[ticketPosition]);
					ticketStorage.set(tickets);

					return [...tickets];
				}
			}

			tickets[ticketPosition].products.push({ product: product, quantity: 1 });
			tickets[ticketPosition].total = totalCalculation(tickets, ticketPosition);
			selectedTicket.set(tickets[ticketPosition]);
			ticketStorage.set(tickets);

			return [...tickets];
		});
	};

	const removeProduct = (productId) => {
		update((tickets) => {
			const ticketPosition = tickets.findIndex((ticket) => ticket.selectedTicket === true);

			const products = tickets[ticketPosition].products;

			const index = products.findIndex((product) => product.product._id === productId);
			products.splice(index, 1);

			tickets[ticketPosition].products = [];
			tickets[ticketPosition].products = products;

			tickets[ticketPosition].total = totalCalculation(tickets, ticketPosition);

			selectedTicket.set(tickets[ticketPosition]);
			ticketStorage.set(tickets);
			return [...tickets];
		});
	};

	const addProduct = (productId) => {
		update((tickets) => {
			const ticketPosition = tickets.findIndex((ticket) => ticket.selectedTicket === true);

			for (let i = 0; i < tickets[ticketPosition].products.length; i++) {
				if (tickets[ticketPosition].products[i].product._id === productId) {
					tickets[ticketPosition].products[i].quantity =
						tickets[ticketPosition].products[i].quantity + 1;

					tickets[ticketPosition].total = totalCalculation(tickets, ticketPosition);
					selectedTicket.set(tickets[ticketPosition]);
					ticketStorage.set(tickets);
				}
			}

			return [...tickets];
		});
	};

	const deductProduct = (productId) => {
		update((tickets) => {
			const ticketPosition = tickets.findIndex((ticket) => ticket.selectedTicket === true);

			for (let i = 0; i < tickets[ticketPosition].products.length; i++) {
				if (tickets[ticketPosition].products[i].product._id === productId) {
					if (tickets[ticketPosition].products[i].quantity > 1) {
						tickets[ticketPosition].products[i].quantity =
							tickets[ticketPosition].products[i].quantity - 1;

						tickets[ticketPosition].total = totalCalculation(tickets, ticketPosition);
						selectedTicket.set(tickets[ticketPosition]);
						ticketStorage.set(tickets);
					}
				}
			}

			return [...tickets];
		});
	};

	onLoad();

	return {
		subscribe,
		addTicket,
		removeTicket,
		addProductToTicket,
		removeProduct,
		addProduct,
		deductProduct,
		selectTicket: (ticket) => {
			update((tickets) => {
				for (let i = 0; i < tickets.length; i++) {
					tickets[i].selectedTicket = false;
				}

				tickets[ticket].selectedTicket = true;

				selectedTicket.set(tickets[ticket]);
				ticketStorage.set(tickets);

				return [...tickets];
			});
		},
		searchCustomer: async (phone) => {
			const formData = new FormData();
			formData.append('phone', phone);

			const response = await fetch('/customers?/getByPhone', {
				method: 'POST',
				body: formData
			});
			const data = await response.json();

			return data;
		},
		setCustomerTicket: (ticket, customerInfo) => {
			update((tickets) => {
				if (customerInfo._id) {
					const existingTicket = tickets.findIndex(
						(customer) => customer.customer._id === customerInfo._id
					);

					if (existingTicket >= 0) {
						for (let i = 0; i < tickets.length; i++) {
							tickets[i].selectedTicket = false;
						}

						tickets[existingTicket].selectedTicket = true;

						selectedTicket.set(tickets[existingTicket]);
						ticketStorage.set(tickets);
						return [...tickets];
					}

					tickets[ticket].customer = customerInfo;
				} else {
					tickets[ticket].customer = {};
					tickets[ticket].customer.phone = customerInfo;
				}
				ticketStorage.set(tickets);
				return [...tickets];
			});
		},
		reset: () => {
			set(initialValues);
		},
		completeOrder: (status, delivery) => {
			let response;
			update((tickets) => {
				const ticketPosition = tickets.findIndex((ticket) => ticket.selectedTicket === true);

				tickets[ticketPosition].status = status;
				tickets[ticketPosition].delivery = delivery;

				postOrder(tickets[ticketPosition]).then((res) => (response = res));

				if (tickets.length === 1) {
					tickets = tickets.filter((ticket, index) => index !== ticketPosition);
					tickets = [
						{
							customer: {},
							products: [],
							total: 0,
							selectedTicket: false,
							status: 'open',
							devivered: 'pending'
						}
					];

					tickets[0].selectedTicket = true;

					selectedTicket.set(tickets[0]);
					ticketStorage.set(tickets);
				} else {
					for (let i = 0; i < tickets.length; i++) {
						tickets[i].selectedTicket = false;
					}

					tickets[0].selectedTicket = true;

					tickets = tickets.filter((ticket, index) => index !== ticketPosition);

					selectedTicket.set(initialValues[0]);
					ticketStorage.set(tickets);
				}
				return [...tickets];
			});
		}
	};
}

export const tickets = ticketStore();
