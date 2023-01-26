<script>
	import { tickets } from './store';

	function addTicket() {
		tickets.addTicket();
	}
</script>

<svelte:head>
	<title>Cliente nuevo</title>
	<style>
		body {
			background-color: rgb(243 244 246);
		}

		::-webkit-scrollbar {
			width: 0.5em;
		}
		::-webkit-scrollbar-track {
			background-color: rgb(229 231 235);
			border-radius: 100vw;
		}
		::-webkit-scrollbar-thumb {
			background-color: rgb(209 213 219);
			border-radius: 100vw;
		}
	</style>
</svelte:head>

<section class="grid-rows-1/1 grid h-[calc(100vh-66px)] grid-cols-6 gap-4 p-7">
	<div class="col-span-1 flex h-full flex-col overflow-auto rounded bg-white shadow-md">
		<div class="overflow-auto">
			{#each $tickets as ticket}
				<input type="hidden" name="product" />
				<button class="w-full bg-blue-500 py-2 text-white hover:bg-blue-600">
					{ticket.customer ?? 'ticket'}
				</button>
			{/each}
		</div>
		<div class="mt-auto">
			<button
				type="button"
				class="mt-auto w-full bg-indigo-500 py-2 text-white hover:bg-indigo-600"
				on:click={addTicket}>Agregar ticket</button
			>
		</div>
	</div>
	<div class="col-span-3 rounded bg-white shadow-md">2</div>
	<div class="col-span-2 rounded bg-white shadow-md">3</div>
</section>
