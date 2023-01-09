<div class="navbar bg-base-100 rounded">
	<div class="navbar-start">
		<a href="/" class="btn btn-ghost normal-case text-xl">Papelería El Cyber</a>
	</div>
	<div class="navbar-center">
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/orders">Caja</a></li>
				<li tabIndex="0">
					<a href="#">
						Productos
						<svg
							class="fill-current"
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg
						>
					</a>
					<ul class="p-2 bg-base-100">
						<li><a href="/products/new-product">Crear productos</a></li>
						<li><a href="/products/get-products">Ver productos</a></li>
					</ul>
				</li>
				<li tabIndex="0">
					<a href="#">
						Clientes
						<svg
							class="fill-current"
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg
						>
					</a>
					<ul class="p-2 bg-base-100">
						<li><a href="/customers/new-customer">Nuevo cliente</a></li>
						<li><a href="/customers/get-customers">Ver clientes</a></li>
					</ul>
				</li>
				<li><a href="/categories">Categorías</a></li>
			</ul>
		</div>
	</div>
	<div class="navbar-end">
		<div class="dropdown dropdown-end">
			<label tabIndex="0" class="btn btn-ghost btn-circle avatar">
				<div class="w-10 rounded-full">
					<img src="https://placeimg.com/80/80/people" />
				</div>
			</label>
			<ul
				tabIndex="0"
				class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
			>
				<li>
					<a class="justify-between">
						Profile
						<span class="badge">New</span>
					</a>
				</li>
				<li><a>Settings</a></li>
				<li><a>Logout</a></li>
			</ul>
		</div>
	</div>
</div>
