import { writable } from 'svelte/store';

export const selectedTicket = writable({});

function createDailySalesStore() {
	const { subscribe, update, set } = writable([]);

	const reset = () => {
		set([]);
	};

	const setData = (data) => {
		update(() => {
			if (data.length > 0) {
				const tickets = data.map((ticket) => ({ ...ticket, selectedTicket: false }));

				const notCancelledTicket = tickets.findIndex(
					(ticket) => ticket.orderStatus === 'completed'
				);

				tickets[notCancelledTicket].selectedTicket = true;
				selectedTicket.set(tickets[0]);
				return [...tickets];
			} else {
				return [];
			}
		});
	};

	const selectTicket = (ticket) => {
		update((tickets) => {
			for (let i = 0; i < tickets.length; i++) {
				tickets[i].selectedTicket = false;
			}

			tickets[ticket].selectedTicket = true;

			selectedTicket.set(tickets[ticket]);

			return [...tickets];
		});
	};

	return {
		subscribe,
		reset,
		setData,
		selectTicket
	};
}

export const dailySalesStore = createDailySalesStore();
