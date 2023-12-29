<script>
	import { getContext } from 'svelte';

	const user = getContext('user');
</script>

<div class="dropdown-end dropdown">
	<div tabindex="0" role="button" class="btn-ghost btn btn-circle avatar">
		<div class="w-10 rounded-full">
			<img
				alt="Tailwind CSS Navbar component"
				src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
			/>
		</div>
	</div>
	<ul
		tabindex="0"
		class="dropdown-content menu menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
	>
		<li>
			<a href="/profile" class="justify-between">Perfil</a>
		</li>
		<li><a href="/settings">Configuraciones</a></li>
		<li><a href="/logout">Logout</a></li>
	</ul>
</div>
