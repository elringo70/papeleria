<script>
	import Icon from '@iconify/svelte';

	export let ticket;
	export let index;

	export let onClick = () => {};
	export let onDblClick = () => {};
	export let removeTicket = () => {};
</script>

<button
	type="button"
	class="w-full py-2 px-3 {ticket.selectedTicket
		? 'bg-blue-500 text-white hover:bg-blue-600'
		: 'bg-gray-50 hover:bg-gray-100'}"
	value={index}
	on:click={onClick}
	on:dblclick={onDblClick}
>
	<div class="flex items-center justify-start">
		<div>
			{ticket.customer?.name
				? ticket.customer?.lastName
					? ticket.customer?.name + ' ' + ticket.customer?.lastName
					: ticket.customer?.name
				: ticket.customer?.phone
				? ticket.customer?.phone
				: `Ticket ${index + 1}`}
		</div>
		<button
			on:click={removeTicket}
			value={index}
			class="ml-auto rounded bg-red-500 p-1 text-lg text-white hover:bg-red-600"
		>
			<Icon icon="material-symbols:cancel-outline" />
		</button>
	</div>
</button>
