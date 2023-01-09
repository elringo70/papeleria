<script>
	export let pill = 'active' | 'pending';

	const PillColor = {
		active: {
			textColor: 'bg-green-200',
			backgroundColor: 'text-green-900',
			text: 'Activo'
		},
		pending: {
			textColor: 'bg-red-200',
			backgroundColor: 'text-red-900',
			text: 'Saldo pendiente'
		}
	};
</script>

<span
	class={`py-1 px-3 rounded-full ${PillColor[pill].textColor} ${PillColor[pill].backgroundColor}`}
	>{PillColor[pill].text}</span
>
