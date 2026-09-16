import { createFormHook } from "@tanstack/preact-form";
import { fieldContext, formContext } from "./base";
import TextField from "./fields/TextField";
import DateField from "./fields/DateField";
import ListField from "./fields/ListField";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    DateField,
    ListField,
  },
  formComponents: {},
});
