<script>
	import { InputFile } from '$lib/components';
	import { onMount } from 'svelte';

	let image, cropper, croppedImage, input;
	let showImage = false;

	const onImageLoad = () => {
		const file = input.files[0];

		if (file) {
			showImage = true;

			const reader = new FileReader();
			reader.addEventListener('load', function () {
				image.setAttribute('src', reader.result);
			});

			reader.readAsDataURL(file);

			return;
		}

		showImage = false;
	};

	const setCroppedImage = () => {
		const cropped = cropper.getCroppedCanvas().toDataURL('image/png');
		croppedImage.setAttribute('src', cropped);
	};

	const initCropper = () => {
		cropper = new Cropper(image, {
			aspectRatio: 4 / 3,
			rotatable: false,
			zoomable: false
		});
	};

	onMount(() => {
		image.addEventListener('load', initCropper);
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css"
		integrity="sha512-hvNR0F/e2J7zPPfLC9auFe3/SE0yG4aJCOd/qxew74NN7eyiSKjr7xJJMu1Jy2wf7FXITpWS1E/RY8yzuXN7VA=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js"
		integrity="sha512-9KkIqdfN7ipEW6B6k+Aq20PV31bjODg4AA52W+tYtAE0jE0kMx49bjJ3FgvS56wzmyfMUHbQ4Km2b7l9+Y/+Eg=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	></script>
</svelte:head>

<section class="grid h-[calc(100vh-56px)] grid-cols-4 grid-rows-5 gap-5 bg-gray-100 p-7">
	<div class="col-span-4 row-span-1 bg-white shadow-lg">
		<div class="m-3">
			<InputFile name="image" onChange={onImageLoad} bind:bindElement={input} />
		</div>
	</div>
	<div class="col-span-2 row-span-4 bg-white shadow-lg">
		<div><img alt="" bind:this={image} class="block max-w-full" /></div>
		<div>
			<button
				class="rounded bg-indigo-500 px-3 py-2 text-white shadow shadow-indigo-500 hover:bg-indigo-600"
				type="button"
				on:click={setCroppedImage}>Crop</button
			>
		</div>
	</div>
	<div class="col-span-2 row-span-4 bg-white shadow-lg">
		<div class="h-full w-full">
			<img alt="" bind:this={croppedImage} class="block max-h-full max-w-full" />
		</div>
	</div>
</section>
