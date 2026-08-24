import { actions } from "astro:actions";
import { revalidateLogic, useForm, useSelector } from "@tanstack/preact-form";
import type z from "zod";
import withQuery from "../common/withQuery";
import CustomField from "../form/Field";
import { registerSchema } from "./schema";

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const formHandler = useForm({
    defaultValues: {
      registerAs: "candidate",
    } as RegisterFormData,
    validators: { onChange: registerSchema },
    validationLogic: revalidateLogic({
      modeAfterSubmission: "change",
      mode: "submit",
    }),
    onSubmit: (data) => {
      console.log(data.value);
      actions.register(data.value);
    },
    onSubmitInvalid: (data) => {
      console.error(data);
    },
  });
  const formMode = useSelector(
    formHandler.store,
    (state) => state.values.registerAs,
  );

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        formHandler.handleSubmit();
      }}
      class="inline-flex flex-col gap-2 border border-amber-400 px-4 py-2 rounded-sm"
    >
      <div class="flex flex-row gap-2">
        <button
          type="button"
          data-active={formMode === "candidate"}
          class="data-[active=true]:bg-amber-400 bg-amber-300 flex-1 px-4 py-2"
          onClick={() =>
            formHandler.setFieldValue("registerAs", "candidate", {
              dontValidate: true,
            })
          }
        >
          Candidate
        </button>
        <button
          type="button"
          data-active={formMode === "company"}
          class="data-[active=true]:bg-amber-400 bg-amber-300 flex-1 px-4 py-2"
          onClick={() =>
            formHandler.setFieldValue("registerAs", "company", {
              dontValidate: true,
            })
          }
        >
          Company
        </button>
      </div>
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

      <CustomField
        formHandler={formHandler}
        name="confirmPassword"
        label="Confirm password"
        type="password"
      />

      {formMode === "candidate" && (
        <CustomField
          formHandler={formHandler}
          name="name"
          label="Name"
          type="text"
        />
      )}

      {formMode === "candidate" && (
        <CustomField
          formHandler={formHandler}
          name="surname"
          label="Surname"
          type="text"
        />
      )}
      {formMode === "company" && (
        <CustomField
          formHandler={formHandler}
          name="companyName"
          label="Company name"
          type="text"
        />
      )}

      {formMode === "company" && (
        <formHandler.Field name="locations" mode="array">
          {(field) => (
            <div class="flex flex-col gap-1 px-4 py-2 pt-5 relative border border-amber-400 mt-3">
              <span class="absolute top-0 left-2 px-2 translate-y-[-50%] bg-white">
                Locations
              </span>
              {(field.state.value ?? [""]).map((location, index) => (
                <formHandler.Field
                  key={index}
                  name={`locations[${index}].name`}
                >
                  {(subfield) => (
                    <div class="flex flex-row">
                      <input
                        class="border border-amber-400 px-4 py-2 rounded-l-sm min-w-40 flex-1"
                        type="text"
                        name={subfield.name}
                        value={subfield.state.value}
                        onInput={(e) =>
                          subfield.handleChange(e.currentTarget.value)
                        }
                      />
                      <button
                        type="button"
                        class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-r-sm text-white"
                        onClick={() =>
                          field.removeValue(index, {
                            dontValidate: true,
                          })
                        }
                      >
                        X
                      </button>
                    </div>
                  )}
                </formHandler.Field>
              ))}
              {field.state.value.length < 7 && (
                <button
                  type="button"
                  class="border border-amber-400 hover:bg-amber-400 hover:text-white px-4 py-2 rounded-l-sm min-w-40 flex-1"
                  onClick={() =>
                    field.pushValue("", {
                      dontValidate: true,
                    })
                  }
                >
                  Add location
                </button>
              )}
            </div>
          )}
        </formHandler.Field>
      )}
      <button
        type="submit"
        class="border border-amber-400 hover:bg-amber-400 hover:text-white px-4 py-2 rounded-l-sm min-w-40 flex-1"
      >
        {" "}
        Register
      </button>
    </form>
  );
};

export default withQuery(RegisterForm);
