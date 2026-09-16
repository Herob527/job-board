import { actions } from "astro:actions";
import { useMutation } from "@tanstack/preact-query";
import type z from "zod";
import withQuery from "#/features/common/withQuery";
import jobSchema from "./schema";
import { useAppForm } from "#/core/form/output";

interface Props {
  companyId: string;
}

type JobOfferData = z.infer<typeof jobSchema>;

const CreateJobOffer = ({ companyId }: Props) => {
  const { mutate } = useMutation({
    mutationFn: (data: JobOfferData) =>
      actions.jobOffer.create({
        ...data,
        companyId,
      }),
  });
  const form = useAppForm({
    validators: { onChange: jobSchema },
    onSubmit: (data) => mutate({ ...(data.value as JobOfferData) }),

    onSubmitInvalid: (data) => {
      console.error(data);
    },
  });
  return (
    <form.AppForm
      onSubmit={(ev) => {
        ev.preventDefault();
        form.handleSubmit();
      }}
      class="inline-flex flex-col gap-2 border border-amber-400 px-4 py-2 rounded-sm"
    >
      <form.AppField
        name="title"
        children={(field) => <field.TextField label="Title" />}
      />
      <form.AppField
        name="deadline"
        children={(field) => <field.DateField label="Deadline" />}
      />
    </form.AppForm>
  );
};

export default withQuery(CreateJobOffer);
