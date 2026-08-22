import type { PreactFormExtendedApi } from "@tanstack/preact-form";
import type { HTMLInputTypeAttribute } from "preact";

type AnyPreactFormApi = PreactFormExtendedApi<
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any
>;

interface CustomFieldProps {
	formHandler: AnyPreactFormApi;
	name: string;
	label: string;
	type: HTMLInputTypeAttribute;
}

const CustomField = ({ formHandler, name, label, type }: CustomFieldProps) => {
	return (
		<formHandler.Field
			name={name}
			children={(field) => (
				<>
					<span>{label}</span>

					<input
						type={type}
						name={field.name}
						value={field.state.value}
						onBlur={field.handleBlur}
						class="border border-amber-400 px-4 py-2 rounded-sm"
						onInput={(e) => field.handleChange(e.currentTarget.value)}
					/>

					{field.state.meta.errors.length > 0 && (
						<div class="flex flex-col gap-1">
							{field.state.meta.errors.map((error) => (
								<span>{error?.message}</span>
							))}
						</div>
					)}
				</>
			)}
		/>
	);
};

export default CustomField;
