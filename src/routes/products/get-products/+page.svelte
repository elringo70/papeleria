<script>
	import Icon from '@iconify/svelte';

	export let data;
</script>

<div class="overflow-x-auto">
	<div class="min-w-screen min-h-screen bg-gray-100 flex justify-center font-sans overflow-hidden ">
		<div class="w-full lg:w-5/6">
			<div class="bg-white shadow-lg rounded my-6">
				<table class="min-w-max w-full table-auto">
					<thead>
						<tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
							<th class="py-3 px-6 text-left">Producto</th>
							<th class="py-3 px-6 text-left">Marca</th>
							<th class="py-3 px-6 text-left">Categoría</th>
							<th class="py-3 px-6 text-center">Costo</th>
							<th class="py-3 px-6 text-center">Precio</th>
							<th class="py-3 px-6 text-center">Precio de mayoreo</th>
							<th class="py-3 px-6 text-center">Inventario</th>
							<th class="py-3 px-6 text-center">Acciones</th>
						</tr>
					</thead>
					<tbody class="text-gray-600 text-sm font-light">
						{#each data.products as product}
							<tr
								class="border-b border-gray-200 bg-gray-50 hover:bg-gray-100"
								on:click={() => {
									console.log('click');
								}}
							>
								<td class="py-2 px-5 text-left">
									<div class="flex items-center">
										<span class="font-medium">{product.product}</span>
									</div>
								</td>
								<td class="py-2 px-5 text-left">
									<div class="flex items-center">
										<span>{product.brand}</span>
									</div>
								</td>
								<td class="py-2 px-5 text-center">
									<div class="flex items-center justify-center">{product.category.name}</div>
								</td>
								<td class="py-2 px-5 text-center">$ {product.cost}</td>
								<td class="py-2 px-5 text-center">$ {product.price}</td>
								<td class="py-2 px-5 text-center">{product.wholesale ?? 'Sin mayoreo'}</td>
								<td class="py-2 px-5 text-center">{product.stock?.stock ?? 'Sin inventario'}</td>
								<td class="py-2 px-5 text-center">
									<div class="flex item-center justify-center">
										<div class="mr-2 hover:text-indigo-700 cursor-pointer text-base">
											<Icon icon="mdi:pencil" />
										</div>
										<div class="mr-2 hover:text-indigo-700 cursor-pointer text-base">
											<Icon icon="uil:trash-alt" />
										</div>
									</div>
								</td>
							</tr>
						{:else}
							<td class="py-3 text-center" colspan="8"> ...Sin productos </td>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
