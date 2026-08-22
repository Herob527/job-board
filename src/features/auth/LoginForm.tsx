import { useForm } from "@tanstack/preact-form";
import { loginSchema } from "./schema";

const LoginForm = () => {
	const formHandler = useForm({
		defaultValues: { email: "", password: "" },
		validators: { onChange: loginSchema },
		onSubmit: (data) => {
			console.log(data.value);
		},
		onSubmitInvalid: (data) => {
			console.error(data);
		},
	});
	return (
		<form
			onSubmit={(ev) => {
				ev.preventDefault();
				formHandler.handleSubmit();
			}}
			class="inline-flex flex-col gap-2 border border-amber-400 px-4 py-2 rounded-sm"
		>
			<formHandler.Field
				name="email"
				children={(field) => (
					<>
						<span>E-mail</span>
						<input
							type="email"
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							class="border border-amber-400 px-4 py-2 rounded-sm"
							onInput={(e) =>
								field.handleChange((e.target as HTMLInputElement).value)
							}
						/>
						{field.state.meta.errors.length > 0 && (
							<div class="flex flex-col gap-1">
								{field.state.meta.errors.map((it) => (
									<span>{it?.message}</span>
								))}
							</div>
						)}
					</>
				)}
			/>

			<formHandler.Field
				name="password"
				children={(field) => (
					<>
						<span>Password</span>
						<input
							type="password"
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							class="border border-amber-400 px-4 py-2 rounded-sm"
							onInput={(e) =>
								field.handleChange((e.target as HTMLInputElement).value)
							}
						/>

						{field.state.meta.errors.length > 0 && (
							<div class="flex flex-col gap-1">
								{field.state.meta.errors.map((it) => (
									<span>{it?.message}</span>
								))}
							</div>
						)}
					</>
				)}
			/>

			<button type="submit" class="bg-amber-300 px-4 py-2 rounded-sm">
				Login
			</button>
		</form>
	);
};

export default LoginForm;
