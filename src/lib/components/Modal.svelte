<script>
	export let closeModal = () => {};
</script>

<div
	class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
>
	<div class="relative w-3/6 my-6 mx-auto">
		<!--content-->
		<div class="relative flex flex-col w-full bg-white outline-none focus:outline-none">
			<!--header-->
			<slot name="title" />
			<!--body-->
			<slot name="body" />

			<!--footer-->
			<slot name="footer" />
		</div>
	</div>
</div>
<div class="opacity-25 fixed inset-0 z-40 bg-black" />

<!-- <div class="flex items-start justify-between p-5 text-gray-600">
  <h3 class="text-3xl font-semibold">Modal Title</h3>
  <button
    class="p-1 ml-auto bg-transparent float-right leading-none font-semibold outline-none focus:outline-none"
    on:click={closeModal}
  >
    <Icon icon="maki:cross" />
  </button>
</div> -->
