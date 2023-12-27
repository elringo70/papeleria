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
      paid: paid and pending delivery or be delivered
    */
		status: false,
		/*
      pending: pending to be delivered
      delivered: order delivered
    */
		delivered: false
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

	const totalCalculation = (tickets, ticketPosition) => {
		let total = 0;
		for (let i = 0; i < tickets[ticketPosition].products.length; i++) {
			total +=
				tickets[ticketPosition].products[i].quantity *
				tickets[ticketPosition].products[i].product.price;
		}

		return total;
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
					status: false,
					delivered: false
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
			} else {
				tickets[ticketIndex] = {
					customer: {},
					products: [],
					total: 0,
					selectedTicket: true,
					status: false,
					delivered: false
				};
			}
			selectedTicket.set(tickets[0]);

			for (let i = 0; i < tickets.length; i++) {
				tickets[i].selectedTicket = false;
			}

			tickets[0].selectedTicket = true;

			ticketStorage.set(tickets);
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

	const setCustomerTicket = (customerInfo) => {
		update((tickets) => {
			const ticketPosition = tickets.findIndex((ticket) => ticket.selectedTicket === true);

			if (customerInfo && customerInfo._id) {
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

				tickets[ticketPosition].customer = customerInfo;
			} else {
				tickets[ticketPosition].customer = {};
				tickets[ticketPosition].customer.phone = customerInfo;
			}
			selectedTicket.set(tickets[ticketPosition]);
			ticketStorage.set(tickets);

			return [...tickets];
		});
	};

	const selectTicket = (ticket) => {
		update((tickets) => {
			for (let i = 0; i < tickets.length; i++) {
				tickets[i].selectedTicket = false;
			}

			tickets[ticket].selectedTicket = true;

			selectedTicket.set(tickets[ticket]);
			ticketStorage.set(tickets);

			return [...tickets];
		});
	};

	const checkedStatus = () => {
		update((tickets) => {
			const ticketPosition = tickets.findIndex((ticket) => ticket.selectedTicket === true);

			tickets[ticketPosition].status = !tickets[ticketPosition].status;

			selectedTicket.set(tickets[ticketPosition]);
			ticketStorage.set(tickets);

			return [...tickets];
		});
	};

	const checkedDelivery = () => {
		update((tickets) => {
			const ticketPosition = tickets.findIndex((ticket) => ticket.selectedTicket === true);

			tickets[ticketPosition].delivered = !tickets[ticketPosition].delivered;

			selectedTicket.set(tickets[ticketPosition]);
			ticketStorage.set(tickets);

			return [...tickets];
		});
	};

	const reset = () => {
		set(initialValues);
	};

	const completeOrder = () => {
		update((tickets) => {
			const ticketPosition = tickets.findIndex((ticket) => ticket.selectedTicket === true);

			if (tickets.length > 1) {
				tickets = tickets.filter((_, index) => index !== ticketPosition);
				selectTicket(0);
				selectedTicket.set(tickets[0]);
				ticketStorage.set(tickets);
			} else {
				tickets[0] = {
					customer: {},
					products: [],
					total: 0,
					selectedTicket: true,
					status: false,
					delivered: false
				};

				selectedTicket.set({
					customer: {},
					products: [],
					total: 0,
					selectedTicket: true,
					status: false,
					delivered: false
				});

				ticketStorage.set(tickets);

				return [...tickets];
			}
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
		setCustomerTicket,
		selectTicket,
		reset,
		checkedStatus,
		checkedDelivery,
		completeOrder
	};
}

export const tickets = ticketStore();
