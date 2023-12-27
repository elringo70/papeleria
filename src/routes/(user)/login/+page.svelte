<script>
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components';

	const handleSubmit = () => {
		return async ({ result, update }) => {
			const { type, data } = result;
			switch (type) {
				case 'success':
					console.log(data);
					break;
			}
		};
	};
</script>

<section class="flex h-[calc(100vh-56px)] items-center justify-center bg-gray-200">
	<div
		class="mx-auto flex flex-col items-center justify-center rounded-lg bg-gray-800 px-6 py-8 shadow-lg shadow-gray-700 lg:py-0"
	>
		<div class="w-full sm:max-w-md md:mt-0 xl:p-0">
			<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
				<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-300 md:text-2xl">
					Inicie sesión a su cuenta
				</h1>
				<form
					class="space-y-4 md:space-y-6"
					method="post"
					use:enhance={handleSubmit}
					autocomplete="off"
				>
					<div>
						<Input
							name="email"
							label="Email"
							placeholder="name@company.com"
							required={true}
							type="email"
						/>
						<Input
							name="password"
							label="Contraseña"
							placeholder="******"
							required={true}
							type="password"
						/>

						<div class="flex items-center justify-between">
							<div class="flex items-start">
								<div class="flex h-5 items-center">
									<input
										id="remember"
										aria-describedby="remember"
										type="checkbox"
										class="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
										required=""
									/>
								</div>
								<div class="ml-3 text-sm">
									<label for="remember" class="text-gray-500 dark:text-gray-300">Recuerdame</label>
								</div>
							</div>
							<a
								href="#"
								class="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
								>Olvide contraseña</a
							>
						</div>
						<div class="py-5">
							<button
								type="submit"
								class="focus:ring-primary-300 w-full rounded bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4"
								>Sign in</button
							>
						</div>
						<p class="text-sm font-light text-gray-500 dark:text-gray-400">
							¿Aun no tienes cuenta? <a
								href="#"
								class="text-primary-600 dark:text-primary-500 font-medium hover:underline"
								>Sign up</a
							>
						</p>
					</div>
				</form>
			</div>
		</div>
	</div>
</section>
