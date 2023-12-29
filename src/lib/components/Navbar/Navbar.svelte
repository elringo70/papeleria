<script>
	import UserProfile from './UserProfile.svelte';
	import DropdownLink from './DropdownLink.svelte';
	import NavbarLink from './NavbarLink.svelte';
	import { getContext } from 'svelte';

	const user = getContext('user');

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
				<!-- Profile dropdown -->
				<UserProfile />
			</div>
		</div>
	</div>
</nav>
