<script>
	import { goto } from '$app/navigation';
	import { signOut } from 'firebase/auth';
	import { invalidateAll } from '$app/navigation';
	import { auth } from '../../utils/firebase';

	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider,
		Chevron
	} from 'flowbite-svelte';

	export let user;

	const logout = async () => {
		const formData = new FormData();
		formData.append('logout', 'logout');

		const response = await fetch('/api/user/logout', {
			method: 'POST',
			body: formData,
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			await signOut(auth);
			await invalidateAll();
			goto('/');
		}
	};
</script>

{#if user}
	<Navbar let:hidden let:toggle>
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
				>Papelería El Cyber</span
			>
		</NavBrand>
		<div class="flex items-center md:order-2">
			<Avatar id="avatar-menu" src="./noimage.png" />
			<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
		</div>
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			<DropdownHeader>
				<span class="block text-sm"> Bonnie Green </span>
				<span class="block truncate text-sm font-medium"> name@flowbite.com </span>
			</DropdownHeader>
			<DropdownItem>Configuración</DropdownItem>
			<DropdownItem>Perfil</DropdownItem>
			<DropdownDivider />
			<DropdownItem on:click={logout}>Logout</DropdownItem>
		</Dropdown>
		<NavUl
			{hidden}
			ulClass="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium"
		>
			<NavLi href="/orders">Caja</NavLi>
			<NavLi id="nav-products" class="cursor-pointer"><Chevron aligned>Productos</Chevron></NavLi>
			<Dropdown triggeredBy="#nav-products" class="z-20 w-44">
				<DropdownItem href="/products/new-product">Nuevo Producto</DropdownItem>
				<DropdownItem href="/products/get-products">Ver Productos</DropdownItem>
			</Dropdown>
			<NavLi id="nav-customers" class="cursor-pointer"><Chevron aligned>Clientes</Chevron></NavLi>
			<Dropdown triggeredBy="#nav-customers" class="z-20 w-44">
				<DropdownItem href="/customers/new-customer">Nuevo Cliente</DropdownItem>
				<DropdownItem href="/customers/get-customers">Ver Clientes</DropdownItem>
			</Dropdown>
			<NavLi href="/categories">Categoría</NavLi>
		</NavUl>
	</Navbar>
{/if}
