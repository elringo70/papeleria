<script>
	import UserProfile from './UserProfile.svelte';
	import DropdownLink from './DropdownLink.svelte';
	import NavbarLink from './NavbarLink.svelte';

	const navbarLinks = [
		{ name: 'Caja', href: '/orders', active: false },
		{
			name: 'Clientes',
			active: false,
			dropdown: {
				links: [
					{ name: 'Nuevo cliente', href: '/customers/new-customer' },
					{ name: 'Ver clientes', href: '/customers/get-customers' }
				],
				isOpen: false
			}
		},
		{
			name: 'Productos',
			active: false,
			dropdown: {
				links: [
					{ name: 'Crear producto', href: '/products/new-product' },
					{ name: 'Ver productos', href: '/products/get-products' }
				],
				isOpen: false
			}
		},
		{ name: 'Categorías', href: '/categories', active: false },
		{ name: 'Estadísticas', href: '/stadistics', active: false },
		{ name: 'Test', href: '/test', active: false }
	];

	const clickOnNavbarLink = () => {};
</script>

<!-- Main navigation container -->
<nav>
	<div class="mx-auto max-w-7xl px-1 sm:px-1 lg:px-1">
		<div class="relative flex h-14 items-center justify-between">
			<div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
				<!-- Mobile menu button-->
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
					aria-controls="mobile-menu"
					aria-expanded="false"
				>
					<span class="sr-only">Open main menu</span>
					<!--
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          -->
					<svg
						class="block h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
					<!--
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          -->
					<svg
						class="hidden h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
				<div class="flex flex-shrink-0 items-center">
					<img
						class="block h-8 w-auto lg:hidden"
						src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
						alt="Your Company"
					/>
					<img
						class="hidden h-8 w-auto lg:block"
						src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
						alt="Your Company"
					/>
				</div>
				<div class="hidden sm:ml-6 sm:block">
					<div class="flex space-x-4">
						{#each navbarLinks as link}
							{#if link.dropdown}
								<DropdownLink linkName={link.name} submenuLinks={link.dropdown.links} />
							{:else}
								<NavbarLink name={link.name} href={link?.href} />
							{/if}
						{/each}
					</div>
				</div>
			</div>
			<div
				class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
			>
				<button
					type="button"
					class="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
				>
					<span class="sr-only">View notifications</span>
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
						/>
					</svg>
				</button>

				<!-- Profile dropdown -->
				<UserProfile />
			</div>
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
	<!-- <div class="sm:hidden" id="mobile-menu">
		<div class="space-y-1 px-2 pb-3 pt-2">
			
			<a
				href="#"
				class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
				aria-current="page">Dashboard</a
			>
			<a
				href="#"
				class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
				>Team</a
			>
			<a
				href="#"
				class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
				>Projects</a
			>
			<a
				href="#"
				class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
				>Calendar</a
			>
		</div>
	</div> -->
</nav>

<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->

