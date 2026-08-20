import { useForm, useSelector } from "@tanstack/preact-form";
import z from "zod";

const loginSchema = z.object({
	email: z.email().min(5).max(40),
	password: z.string().min(5).max(20),
});

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
	const email = useSelector(formHandler.store, (state) => state.values.email);
	console.log(email);
	return (
		<form
			onSubmit={(ev) => {
				ev.preventDefault();
				formHandler.handleSubmit();
			}}
			class="inline-flex flex-col gap-2"
		>
			<formHandler.Field
				name="email"
				children={(field) => (
					<>
						<span>E-mail</span>
						<input
							type="email"
							value={field.state.value}
							onBlur={field.handleBlur}
							class="border border-amber-400"
							onInput={(e) =>
								field.handleChange((e.target as HTMLInputElement).value)
							}
						/>
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
							value={field.state.value}
							onBlur={field.handleBlur}
							class="border border-amber-400"
							onInput={(e) =>
								field.handleChange((e.target as HTMLInputElement).value)
							}
						/>
					</>
				)}
			/>

			<button type="submit">Login</button>
		</form>
	);
};

export default LoginForm;
