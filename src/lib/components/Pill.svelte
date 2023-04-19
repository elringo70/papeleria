<script>
	export let text;

	/**
	 * @type {('success' | 'warning' | 'error' | 'secondary' | 'primary' )} pillColor
	 */
	export let pill = 'success';
	const pillColor = {
		success: {
			textColor: 'text-green-800',
			backgroundColor: 'bg-green-200',
			shadowColor: 'shadow shadow-green-200'
		},
		primary: {
			textColor: 'text-blue-800',
			backgroundColor: 'bg-blue-200',
			shadowColor: 'shadow shadow-blue-200'
		},
		warning: {
			textColor: 'text-yellow-200',
			backgroundColor: 'bg-yellow-800',
			shadowColor: 'shadow shadow-yellow-200'
		},
		error: {
			textColor: 'text-red-800',
			backgroundColor: 'bg-red-200',
			shadowColor: 'shadow shadow-red-200'
		},
		secondary: {
			textColor: 'text-gray-800',
			backgroundColor: 'bg-gray-200',
			shadowColor: 'shadow shadow-gray-200'
		}
	};
</script>

<span
	class={`rounded-full py-1 px-3 ${pillColor[pill].textColor} ${pillColor[pill].backgroundColor} ${pillColor[pill].shadowColor} cursor-default`}
	>{text}</span
>
