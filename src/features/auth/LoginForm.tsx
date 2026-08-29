import { actions } from "astro:actions";
import { revalidateLogic, useForm } from "@tanstack/preact-form";
import { useMutation } from "@tanstack/preact-query";
import type z from "zod";
import withQuery from "../common/withQuery";
import CustomField from "../form/Field";
import { loginSchema } from "./schema";

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { mutate } = useMutation({
    mutationFn: (data: LoginFormData) => actions.login(data),
    onSuccess: () => {
      location.reload();
    },
  });
  const formHandler = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: { onChange: loginSchema },
    validationLogic: revalidateLogic({
      modeAfterSubmission: "change",
      mode: "submit",
    }),
    onSubmit: (data) => mutate(data.value),
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

export default withQuery(LoginForm);
