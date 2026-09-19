import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./base";
import DateField from "./fields/DateField";
import ListField from "./fields/ListField";
import TextareaField from "./fields/TextareaField";
import TextField from "./fields/TextField";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    DateField,
    ListField,
    TextareaField,
  },
  formComponents: {},
});
