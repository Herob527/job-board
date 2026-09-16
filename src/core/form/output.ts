import { createFormHook } from "@tanstack/preact-form";
import { fieldContext, formContext } from "./base";
import TextField from "./TextField";
import DateField from "./DateField";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    DateField,
  },
  formComponents: {},
});
