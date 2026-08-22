import { useForm } from "@tanstack/preact-form";
import { loginSchema } from "./schema";
import CustomField from "../form/Field";

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
			<CustomField
				formHandler={formHandler}
				name="email"
				label="E-mail"
				type="email"
			/>

			<CustomField
				formHandler={formHandler}
				name="password"
				label="Password"
				type="password"
			/>

			<button type="submit" class="bg-amber-300 px-4 py-2 rounded-sm">
				Login
			</button>
		</form>
	);
};

export default LoginForm;
