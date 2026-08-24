import { useForm } from "@tanstack/preact-form";
import { registerSchema } from "./schema";
import type z from "zod";
import withQuery from "../common/withQuery";

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
	const formHandler = useForm({
		defaultValues: {} as RegisterFormData,
		validators: { onChange: registerSchema },
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
		></form>
	);
};

export default withQuery(RegisterForm);
