<script>
	export let type = 'submit';
	export let disabled = false;
	export let name = 'Guardar';
	export let backgroundColor = 'bg-gray-400';
	export let hoverColor = 'bg-gray-300';
	export let shadow = 'shadow';
	export let shadowColor = 'shadow-gray-400';
	export let textColor = 'text-black';

	export let paddingX = 'px-4';
	export let paddingY = 'py-2';

	const buttonObject = {
		textColor: '',
		backgroundColor: '',
		hoverBackgroundColor: '',
		shadow: '',
		shadowColor: '',
		paddingX: '',
		paddingY: ''
	};
</script>

<button
	{type}
	class={`${backgroundColor} ${hoverColor} ${textColor} ${shadow} ${shadowColor} ${paddingX} ${paddingY} rounded`}
	{disabled}>{name}</button
>
