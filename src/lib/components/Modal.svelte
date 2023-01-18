<script>
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	export let title;
	export let content = undefined;
	export let textCancelButton = 'Cancelar';
	export let textConfirmButton = 'Guardar';
	export let type = 'success' | 'info' | 'danger' | 'warning' | 'error';
	export let confirmSave = undefined;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	const modalType = {
		danger: {
			textColor: 'text-white',
			backgroundColor: 'bg-red-600',
			backgroundColorHover: 'hover:bg-red-700',
			logoTextcolor: 'text-red-600',
			logoBackgroundColor: 'bg-red-100',
			shadowBackgroundColor: 'shadow-red-600'
		},
		info: {
			textColor: 'text-white',
			backgroundColor: 'bg-blue-600',
			backgroundColorHover: 'hover:bg-blue-700',
			logoTextcolor: 'text-blue-600',
			logoBackgroundColor: 'bg-blue-100',
			shadowBackgroundColor: 'shadow-blue-600'
		},
		success: {
			textColor: 'text-white',
			backgroundColor: 'bg-green-600',
			backgroundColorHover: 'hover:bg-green-700',
			logoTextcolor: 'text-green-600',
			logoBackgroundColor: 'bg-green-100',
			shadowBackgroundColor: 'shadow-green-600'
		},
		warning: {
			textColor: 'text-white',
			backgroundColor: 'bg-indigo-600',
			backgroundColorHover: 'hover:bg-indigo-700',
			shadowBackgroundColor: 'shadow-indigo-600',
			logoTextcolor: 'text-amber-600',
			logoBackgroundColor: 'bg-amber-100'
		},
		error: {}
	};
</script>

{#each Object.entries(modalType) as [modal, attributes]}
	{#if type === modal}
		<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
			<!--
      Background backdrop, show/hide based on modal state.
  
      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				in:fade={{ duration: 500 }}
				out:fade
			/>

			<div class="fixed inset-0 z-10 overflow-y-auto" in:fly={{ y: -200, duration: 700 }}>
				<div
					class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
				>
					<!--
          Modal panel, show/hide based on modal state.
  
          Entering: "ease-out duration-300"
            From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            To: "opacity-100 translate-y-0 sm:scale-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100 translate-y-0 sm:scale-100"
            To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        -->
					<div
						class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
					>
						<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
							<div class="sm:flex sm:items-start">
								<div
									class={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${attributes.logoBackgroundColor} sm:mx-0 sm:h-10 sm:w-10`}
								>
									<div class={`text-xl ${attributes.logoTextcolor}`}>
										{#if modal === 'danger'}
											<Icon icon="ph:x-duotone" />
										{:else if modal === 'success'}
											<Icon icon="mdi:success" />
										{:else if modal === 'info'}
											<Icon icon="mdi:information-variant" />
										{:else if modal === 'warning'}
											<Icon icon="bi:exclamation-lg" />
										{/if}
									</div>
								</div>
								<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
										{title}
									</h3>
									{#if content}
										<div class="mt-2">
											<p class="text-sm text-gray-500">
												{content}
											</p>
										</div>
									{/if}
								</div>
							</div>
						</div>
						<div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
							{#if confirmSave}
								<button
									type="button"
									class={`inline-flex w-full justify-center rounded ${attributes.backgroundColor} shadow ${attributes.backgroundColorHover} ${attributes.shadowBackgroundColor} px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
									on:click={confirmSave}>{textConfirmButton}</button
								>
								<button
									type="button"
									class="mt-3 inline-flex w-full justify-center rounded bg-gray-50 px-4 py-2 text-base font-medium text-gray-700 shadow hover:bg-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
									on:click={close}>{textCancelButton}</button
								>
							{:else}
								<button
									type="button"
									class={`inline-flex w-full justify-center rounded bg-indigo-600 shadow hover:bg-indigo-700 shadow-indigo-600 px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
									>Entendido</button
								>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/each}
