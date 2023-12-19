import { writable } from 'svelte/store';

export const selectedTicket = writable({})

function createDailySalesStore() {
  const { subscribe, set } = writable([]);

  const reset = () => {
    set([]);
  };

  const setData = (data) => {
    set(data);
  };

  const selectTicket = (ticket) => {
    selectedTicket.set(ticket)
  }

  return {
    subscribe,
    reset,
    setData,
    selectTicket
  };
}

export const dailySalesStore = createDailySalesStore();
