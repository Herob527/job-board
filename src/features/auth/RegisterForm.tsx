import { actions } from "astro:actions";
import { revalidateLogic, useForm, useSelector } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import type z from "zod";
import withQuery from "../common/withQuery";
import CustomField from "../form/Field";
import { registerSchema } from "./schema";

type RegisterFormData = z.infer<typeof registerSchema>;

interface Props {
  registerAs: RegisterFormData["registerAs"];
}

const RegisterForm = ({ registerAs, ...rest }: Props) => {
  const { mutate } = useMutation({
    mutationFn: (data: RegisterFormData) => actions.register(data),
  });
  const formHandler = useForm({
    defaultValues: {
      registerAs,
    } as RegisterFormData,
    validators: { onChange: registerSchema },
    validationLogic: revalidateLogic({
      modeAfterSubmission: "change",
      mode: "submit",
    }),
    onSubmit: (data) => {
      console.log(data.value);
      mutate(data.value);
    },
    onSubmitInvalid: (data) => {
      console.log(data.value);
      console.error(data.formApi.getAllErrors());
    },
  });
  const formMode = useSelector(
    formHandler.store,
    (state) => state.values.registerAs,
  );

  return (
    <form
      {...rest}
      onSubmit={(ev) => {
        ev.preventDefault();
        formHandler.handleSubmit();
      }}
      className={`inline-flex flex-col gap-2 border border-amber-400 px-4 py-2 rounded-sm ${rest.className}`}
    >
      <CustomField
        formHandler={formHandler}
        name="email"
        label={formMode === "candidate" ? "E-mail" : "Owner e-mail"}
        type="email"
      />
      <CustomField
        formHandler={formHandler}
        name="password"
        label="Password"
        type="password"
      />
      <CustomField
        formHandler={formHandler}
        name="confirmPassword"
        label="Confirm password"
        type="password"
      />
      <CustomField
        formHandler={formHandler}
        name="name"
        label={formMode === "candidate" ? "Name" : "Owner's Name"}
        type="text"
      />
      <CustomField
        formHandler={formHandler}
        name="surname"
        label={formMode === "candidate" ? "Surname" : "Owner's surname"}
        type="text"
      />
      {formMode === "company" && (
        <CustomField
          formHandler={formHandler}
          name="companyName"
          label="Company name"
          type="text"
        />
      )}
      {formMode === "company" && (
        <CustomField
          formHandler={formHandler}
          name="registrationLocation"
          label="Company address"
          type="text"
        />
      )}
      <button
        type="submit"
        className="border border-amber-400 hover:bg-amber-400 hover:text-white px-4 py-2 rounded-l-sm min-w-40 flex-1"
      >
        {" "}
        Register
      </button>
    </form>
  );
};

export default withQuery(RegisterForm);
