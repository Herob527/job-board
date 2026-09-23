/** biome-ignore-all lint/correctness/noChildrenProp: <explanation> */
import { actions } from "astro:actions";
import { useMutation } from "@tanstack/react-query";
import type z from "zod";
import { useAppForm } from "#/core/form/output";
import withQuery from "#/features/common/withQuery";
import jobSchema from "./schema";

interface Props {
  companyId: string;
}

const SKILLS = [
  "Typescript",
  "React",
  "NextJS",
  "Astro",
  "TailwindCSS",
  "Kotlin",
  "Android",
  "UX Design",
  "UI Design",
];

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
    defaultValues: {} as JobOfferData,
    validators: { onChange: jobSchema },
    onSubmit: (data) => mutate({ ...data.value }),

    onSubmitInvalid: (data) => {
      console.error(data);
    },
  });
  return (
    <div className="inline-flex flex-col gap-2 border border-amber-400 px-4 py-2 rounded-sm">
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
              multiple
              items={[
                {
                  label: "Hybrid",
                  value: "Hybrid",
                },
                {
                  label: "Remote",
                  value: "Remote",
                },
                {
                  label: "Office",
                  value: "Office",
                },
              ]}
              label="Remote type"
            />
          )}
        />
        <form.AppField
          name="employmentType"
          children={(field) => (
            <field.ListField
              multiple
              items={[
                {
                  label: "Employment Contact",
                  value: "Employment Contact",
                },
                {
                  label: "B2B",
                  value: "B2B",
                },
                {
                  label: "Mandate",
                  value: "Mandate",
                },
              ]}
              label="Employment type"
            />
          )}
        />

        <form.AppField
          name="skills"
          mode="array"
          children={(field) => (
            <div>
              <span>Skills</span>
              <table className="min-w-48">
                <thead>
                  <tr>
                    <th>Skill</th>
                    <th>Level</th>
                  </tr>
                </thead>
                {field.state.value?.map((v, i) => (
                  <tr>
                    <td>
                      <select value={v?.name}>
                        <option>Pick one</option>
                        {SKILLS.map((skill) => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select value={v?.seniority}>
                        <option>Pick one</option>
                        <option value="Junior">Nice to have</option>
                        <option value="Junior">Junior</option>
                        <option value="Mid">Mid</option>
                        <option value="Senior">Senior</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </table>
              <button
                type="button"
                onClick={() => field.pushValue()}
                className="border border-amber-400 px-4 py-2"
              >
                +
              </button>
            </div>
          )}
        />

        <form.AppField
          name="seniority"
          children={(field) => (
            <field.ListField
              multiple
              items={[
                {
                  label: "Junior",
                  value: "Junior",
                },
                {
                  label: "Mid",
                  value: "Mid",
                },
                {
                  label: "Senior",
                  value: "Senior",
                },
              ]}
              label="Seniority"
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
