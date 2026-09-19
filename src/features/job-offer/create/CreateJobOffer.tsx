import { actions } from "astro:actions";
import { useMutation } from "@tanstack/preact-query";
import type z from "zod";
import { useAppForm } from "#/core/form/output";
import withQuery from "#/features/common/withQuery";
import jobSchema from "./schema";

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
    onSubmit: (data) => mutate({ ...data.value }),

    onSubmitInvalid: (data) => {
      console.error(data);
    },
  });
  return (
    <div class="inline-flex flex-col gap-2 border border-amber-400 px-4 py-2 rounded-sm">
      <form.AppForm>
        <form.AppField
          name="title"
          children={(field) => <field.TextField label="Title" />}
        />
        <form.AppField
          name="description"
          children={(field) => <field.TextareaField label="Description" />}
        />

        <form.AppField
          name="remoteType"
          children={(field) => (
            <field.ListField
              items={[
                {
                  label: "Hybrid",
                  value: "hybrid",
                },
                {
                  label: "Remote",
                  value: "remote",
                },
                {
                  label: "On-site",
                  value: "onsite",
                },
              ]}
              label="Remote type"
            />
          )}
        />
        <form.AppField
          name="deadline"
          children={(field) => <field.DateField label="Deadline" />}
        />
      </form.AppForm>
    </div>
  );
};

export default withQuery(CreateJobOffer);
