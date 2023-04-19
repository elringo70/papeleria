<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let currentPage;
	export let totalPages;

	let max = 7;
	let pagesArray = [];
	$: pagesArray = pageNumbers(totalPages, max, currentPage);

	$: disabled = {
		start: () => pagesArray[0] === 1,
		prev: () => currentPage === 1 || currentPage > totalPages,
		end: () => pagesArray.slice(-1)[0] === totalPages,
		next: () => currentPage >= totalPages
	};

	const pageNumbers = (total, max, current) => {
		const half = Math.floor(max / 2);

		let to = max;

		if (current + half >= total) {
			to = total;
		} else if (current > half) {
			to = current + half;
		}

		let from = Math.max(to - max, 0);

		return Array.from({ length: max }, (_, i) => i + 1 + from);
	};

	const nextPage = () => {
		pageNumbers(totalPages, max, currentPage);
		goto(
			'/products/get-products/' +
				(parseInt(currentPage, 10) + 1) +
				($page.url.search ? '/' + $page.url.search : '')
		);
	};

	const previousPage = () => {
		if (currentPage <= 1) return;
		pageNumbers(totalPages, max, currentPage);
		goto(
			'/products/get-products/' +
				(parseInt(currentPage, 10) - 1) +
				($page.url.search ? '/' + $page.url.search : '')
		);
	};
</script>

<div class="flex justify-center">
	<nav aria-label="Page navigation">
		<ul class="list-style-none flex">
			<li class="page-item {disabled.start() ? 'disabled' : ''}">
				<a
					class={disabled.start()
						? 'page-link pointer-events-none relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-500 outline-none transition-all duration-300 focus:shadow-none'
						: 'page-link relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none'}
					href="/products/get-products/1"
					tabindex={disabled.start() ? '-1' : ''}
					aria-disabled={disabled.start() ? 'true' : 'false'}>Inicio</a
				>
			</li>

			<li class="page-item {disabled.prev() ? 'disabled' : ''}">
				<button
					class={disabled.prev()
						? 'page-link pointer-events-none relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-500 outline-none transition-all duration-300 focus:shadow-none'
						: 'page-link relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none'}
					on:click={previousPage}
					tabindex={disabled.prev() ? '-1' : ''}
					aria-disabled={disabled.prev() ? 'true' : ''}>Anterior</button
				>
			</li>

			{#each pagesArray as position}
				<li class="page-item {currentPage === position ? 'active' : ''}">
					<a
						class={currentPage === position
							? 'page-link relative block rounded border-0 bg-blue-600 py-1.5 px-3 text-white shadow-md shadow-blue-400 outline-none transition-all duration-300 hover:bg-blue-600 hover:text-white focus:shadow-md'
							: 'page-link relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none'}
						href="/products/get-products/{position}{$page.url.search ? '/' + $page.url.search : ''}"
						>{position} <span class="visually-hidden" /></a
					>
				</li>
			{/each}

			<li class="page-item {disabled.next() ? 'disabled' : ''}">
				<button
					class={disabled.next()
						? 'page-link pointer-events-none relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-500 outline-none transition-all duration-300 focus:shadow-none'
						: 'page-link relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none'}
					on:click={nextPage}
					tabindex={disabled.next() ? '-1' : ''}
					aria-disabled={disabled.next() ? 'true' : ''}>Siguiente</button
				>
			</li>

			<li class="page-item {disabled.end() ? 'disabled' : ''}">
				<a
					href="/products/get-products/{totalPages}"
					class={disabled.end()
						? 'page-link pointer-events-none relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-500 outline-none transition-all duration-300 focus:shadow-none'
						: 'page-link relative block rounded border-0 bg-transparent py-1.5 px-3 text-gray-800 outline-none transition-all duration-300 hover:bg-gray-200 hover:text-gray-800 focus:shadow-none'}
					on:click={nextPage}
					tabindex={disabled.end() ? '-1' : ''}
					aria-disabled={disabled.end() ? 'true' : ''}>Final</a
				>
			</li>
		</ul>
	</nav>
</div>
