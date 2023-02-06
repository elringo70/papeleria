<script>
	/**
	 * @param {('open' | 'pending' | 'closed')} pill
	 * @param {('pending' | 'delivered')} delivered
	 * **/
	export let pill;
	export let delivered;

	const pillColor = {
		open: {
			textColor: 'bg-green-200',
			backgroundColor: 'text-green-800',
			text: 'Abierto'
		},
		pending: {
			textColor: 'bg-blue-200',
			backgroundColor: 'text-blue-800',
			text: 'Pendiente'
		},
		closed: {
			textColor: 'bg-gray-200',
			backgroundColor: 'text-gray-800',
			text: 'Cerrado'
		}
	};

	const deliveredPill = {
		pending: {
			textColor: 'bg-blue-200',
			backgroundColor: 'text-blue-800',
			text: 'Entrega pendiente'
		},
		delivered: {
			textColor: 'bg-gray-200',
			backgroundColor: 'text-gray-800',
			text: 'Entregado'
		}
	};
</script>

{#if pill}
	<span
		class={`rounded-full py-1 px-3 ${pillColor[pill].textColor} ${pillColor[pill].backgroundColor} cursor-default`}
		>{pillColor[pill].text}</span
	>
{/if}

{#if delivered}
	<span
		class={`rounded-full py-1 px-3 ${deliveredPill[delivered].textColor} ${deliveredPill[delivered].backgroundColor} cursor-default`}
		>{deliveredPill[delivered].text}</span
	>
{/if}
