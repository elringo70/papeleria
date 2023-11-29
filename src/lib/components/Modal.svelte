<script context="module">
	/**
	 * Create a Svelte component with props bound to it.
	 * @type {(component: Component, props: Record<string, any>) => Component}
	 */
	export function bind(Component, props = {}) {
		return function ModalComponent(options) {
			return new Component({
				...options,
				props: {
					...props,
					...options.props
				}
			});
		};
	}
</script>

<script>
	import * as svelte from 'svelte';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	const baseSetContext = svelte.setContext;

	export let show = null;
	export let closeButton = true;
	export let closeOnEsc = true;
	export let closeOnOuterClick = true;
	export let setContext = baseSetContext;
</script>

{#if Component}
	<div />
{/if}
