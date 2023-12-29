<script>
	import { applyAction, deserialize } from '$app/forms';
	import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
	import Swal from 'sweetalert2/dist/sweetalert2.all.js';
	import { Input } from '$lib/components';
	import { auth } from '../../../utils/firebase';

	let errors;
	$: errors;
	let disabled = false;

	async function loginWithEmailAndPassword() {
		disabled = true;
		const formData = new FormData(this);

		const email = formData.get('email');
		const password = formData.get('password');

		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);

			if (!userCredential.user.emailVerified)
				return Swal.fire({ icon: 'error', title: 'Verifique su correo electrónico' });

			const token = await auth.currentUser?.getIdToken();

			const data = new FormData();
			if (token) {
				data.append('token', token);
				data.append('refreshToken', userCredential.user.refreshToken);
			}

			const response = await fetch('?/loginWithEmailAndPassword', {
				method: 'POST',
				body: data
			});

			const result = deserialize(await response.text());

			switch (result.type) {
				case 'failure':
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: result?.data?.message
					});
					break;
			}

			applyAction(result);
		} catch (error) {
			console.log(error);
			const firebaseErrors = ['auth/user-not-found'];

			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Error'
			});
		}

		disabled = false;
	}

	async function loginWithPopUpGoogle() {
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);

			const token = await auth.currentUser?.getIdToken();

			const data = new FormData();
			if (token) {
				data.append('token', token);
			}

			const response = await fetch('?/loginWithGoogle', {
				method: 'POST',
				body: data
			});

			const result = deserialize(await response.text());

			switch (result.type) {
				case 'failure':
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: result?.data?.message
					});
					break;
			}
			applyAction(result);
		} catch (error) {
			console.log(error);
			const firebaseErrors = ['auth/user-not-found'];

			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Error'
			});
		}
	}
</script>

<section class="flex h-screen items-center justify-center bg-gray-100">
	<div class="container mx-auto flex max-w-sm flex-1 flex-col items-center justify-center px-2">
		<div class="w-full rounded bg-white px-6 py-8 text-black shadow-md">
			<h1 class="mb-8 text-center text-3xl">Log in</h1>

			<form method="post" autocomplete="off" on:submit|preventDefault={loginWithEmailAndPassword}>
				<Input placeholder="Correo electrónico" name="email" type="email" required={true} />
				<Input placeholder="Contraseña" name="password" type="password" />

				<button
					type="submit"
					class="w-full rounded bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500"
					{disabled}>Ingresar</button
				>
			</form>
			<div class="text-grey-dark mt-4 text-center text-sm">
				<a class="border-grey-dark text-grey-dark border-b no-underline" href="/signup">
					¿Aun no estas registrado?
				</a>
			</div>

			<div class="mt-5 flex w-full justify-center">
				<form method="post" on:submit|preventDefault={loginWithPopUpGoogle}>
					<button
						class="flex w-full gap-2 rounded-lg border border-slate-200 px-4 py-2 text-slate-700 transition duration-150 hover:border-slate-400 hover:text-slate-900 hover:shadow"
					>
						<img
							class="h-6 w-6"
							src="https://www.svgrepo.com/show/475656/google-color.svg"
							loading="lazy"
							alt="google logo"
						/>
						<span>Login with Google</span>
					</button>
				</form>
			</div>
		</div>

		<div class="text-grey-dark mt-6">
			¿Olvidaste tu contraseña?
			<a class="border-blue text-blue border-b no-underline" href="/login"> Ve aquí </a>.
		</div>
	</div>
</section>
