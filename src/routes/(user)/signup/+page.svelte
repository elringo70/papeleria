<script>
	import { goto } from '$app/navigation';

	import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
	import Swal from 'sweetalert2/dist/sweetalert2.all.js';

	import { auth } from '../../../utils/firebase';
	import { Input } from '$lib/components';

	export let form;
	let disabled = false;
	let errors;
	$: errors;

	const Toast = Swal.mixin({
		toast: true,
		position: 'bottom-end',
		showConfirmButton: false,
		timer: 2000,
		timerProgressBar: true
	});

	async function createUserWithEmailAndPasswordGoogle() {
		disabled = true;
		const formData = new FormData(this);

		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		try {
			if (password === confirmPassword) {
				const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
				if (userCredentials) {
					this.reset();

					await sendEmailVerification(userCredentials.user);

					Toast.fire({
						icon: 'success',
						title: 'Registrado'
					});

					setTimeout(() => {
						goto('/signin');
					}, 2000);
				}
			} else {
				Swal.fire({
					icon: 'warning',
					title: 'Las contraseñas no conciden'
				});
			}

			disabled = false;
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'Error en el servidor'
			});
		}
	}
</script>

<section class="flex h-[calc(100vh-66px)] items-center justify-center bg-gray-100">
	<div class="container mx-auto flex max-w-sm flex-1 flex-col items-center justify-center px-2">
		<div class="w-full rounded bg-white px-6 py-8 text-black shadow-md">
			<h1 class="mb-8 text-center text-3xl">Registrarse</h1>

			<form
				method="post"
				autocomplete="off"
				on:submit|preventDefault={createUserWithEmailAndPasswordGoogle}
			>
				<Input
					placeholder="Correo electrónico"
					name="email"
					type="email"
					required={true}
					value={form?.data?.email ?? ''}
					errors={errors?.email}
				/>
				<Input
					placeholder="Contraseña"
					name="password"
					type="password"
					minlength={6}
					maxlength={40}
					value={form?.data?.password ?? ''}
					errors={errors?.password}
				/>
				<Input
					placeholder="Confirmar contraseña"
					name="confirmPassword"
					type="password"
					minlength={6}
					maxlength={40}
					value={form?.data?.confirmPassword ?? ''}
					errors={errors?.confirmPassword}
				/>

				<button
					type="submit"
					class="w-full rounded bg-indigo-600 py-2 px-3 text-white hover:bg-indigo-500"
					{disabled}>Crear cuenta</button
				>
			</form>
			<div class="text-grey-dark mt-4 text-center text-sm">
				Al registrarse, usted acepta los
				<a class="border-grey-dark text-grey-dark border-b no-underline" href="/terms">
					Terminos y condiciones
				</a>
			</div>
		</div>

		<div class="text-grey-dark mt-6">
			¿Ya tiene cuenta?
			<a class="border-blue text-blue border-b no-underline" href="/signin"> Log in </a>.
		</div>
	</div>
</section>
