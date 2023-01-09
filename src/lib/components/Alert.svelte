<script>
	import Icon from '@iconify/svelte';
	export let alertObject = {};

	const typeObject = {
		success: {
			textColor: 'text-gray-600',
			backgroundColor: 'bg-green-300',
			shadowColor: 'shadow-green-300',
			icon: 'material-symbols:check-small'
		},
		failure: {
			textColor: 'text-amber-900',
			backgroundColor: 'bg-amber-300',
			shadowColor: 'shadow-amber-300',
			icon: 'material-symbols:warning'
		},
		error: {
			textColor: 'text-white',
			backgroundColor: 'bg-red-500',
			shadowColor: 'shadow-red-500',
			icon: 'material-symbols:cancel'
		}
	};
</script>

<div>
	{#each Object.entries(typeObject) as [alert, attributes]}
		{#if alertObject.type === alert}
			<div
				class={`alert ${attributes.backgroundColor} ${attributes.textColor} shadow-lg ${attributes.shadowColor}`}
			>
				<div>
					<Icon icon={attributes.icon} />

					<span>{alertObject.message}</span>
				</div>
			</div>
		{/if}
	{/each}
</div>
