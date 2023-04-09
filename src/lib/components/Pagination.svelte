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

<!-- <nav aria-label="Page navigation">
	<ul class="pagination justify-content-center">
		<li class="page-item {disabled.start() ? 'disabled' : ''}">
			<a class="page-link" href="/products/get-products/1">Inicio</a>
		</li>
		<li class="page-item {disabled.prev() ? 'disabled' : ''}">
			<button class="page-link" on:click={previousPage}>Anterior</button>
		</li>
		{#each pagesArray as position}
			<li class="page-item {currentPage === position ? 'active' : ''}">
				<a
					class="page-link"
					href="/products/get-products/{position}{$page.url.search ? '/' + $page.url.search : ''}"
					>{position}</a
				>
			</li>
		{/each}
		<li class="page-item {disabled.next() ? 'disabled' : ''}">
			<button class="page-link" on:click={nextPage}>Siguiente</button>
		</li>
		<li class="page-item {disabled.end() ? 'disabled' : ''}">
			<a
				class="page-link"
				href="/products/get-products/{totalPages}{$page.url.search ? '/' + $page.url.search : ''}"
				>Final</a
			>
		</li>
	</ul>
</nav> -->

<nav aria-label="Page navigation">
	<ul class="list-style-none flex">
		<li>
			<a
				href="/products/get-products/1"
				class="text-neutral-500 dark:text-neutral-400 pointer-events-none relative block rounded bg-transparent px-3 py-1.5 text-sm transition-all duration-300"
				>Inicio</a
			>
		</li>
		<li>
			<a
				href="/products/get-products/1"
				class="text-neutral-500 dark:text-neutral-400 pointer-events-none relative block rounded bg-transparent px-3 py-1.5 text-sm transition-all duration-300"
				>Anterior</a
			>
		</li>
		<li>
			<a
				class="text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 relative block rounded bg-transparent px-3 py-1.5 text-sm transition-all  duration-300 dark:text-white dark:hover:text-white"
				href="#!">1</a
			>
		</li>
		<li aria-current="page">
			<a
				class="bg-primary-100 text-primary-700 relative block rounded px-3 py-1.5 text-sm font-medium transition-all duration-300"
				href="#!"
				>2
				<span
					class="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"
					>(current)</span
				>
			</a>
		</li>
		<li>
			<a
				class="text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 relative block rounded bg-transparent px-3 py-1.5 text-sm transition-all duration-300 dark:text-white dark:hover:text-white"
				href="#!">3</a
			>
		</li>
		<li>
			<a
				class="text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 relative block rounded bg-transparent px-3 py-1.5 text-sm transition-all duration-300 dark:text-white dark:hover:text-white"
				href="#!">Next</a
			>
		</li>
	</ul>
</nav>
