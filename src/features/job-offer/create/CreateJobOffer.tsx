/** biome-ignore-all lint/correctness/noChildrenProp: <explanation> */
import { actions } from "astro:actions";
import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { useAppForm } from "#/core/form/output";
import withQuery from "#/features/common/withQuery";
import jobSchema, { skillItemSchema } from "./schema";
import { useSelector } from "@tanstack/react-form";
import z4 from "zod/v4";
import { skillSeniorityEnum } from "#/db/schema";

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
  const val = useSelector(form.store, (state) => state.values);
  console.log("[CreateJobOffer - val]", val);
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
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {field.state.value?.map((v, i, arr) => (
                    <tr key={JSON.stringify(v)}>
                      <td>
                        <select
                          value={v?.name}
                          onChange={(e) => {
                            const value = e.currentTarget.value;
                            if (value) {
                              field.setValue((v) => {
                                const newValue = v.with(i, {
                                  name: value,
                                  seniority: v[i]?.seniority,
                                });
                                return newValue;
                              });
                            }
                          }}
                        >
                          {v?.name === undefined && <option>Pick one</option>}

                          {[
                            v?.name,
                            ...SKILLS.filter(
                              (skill) => !arr.find((it) => it?.name === skill),
                            ),
                          ]
                            .filter(Boolean)
                            .map((skill) => (
                              <option key={skill} value={skill}>
                                {skill}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={v?.seniority}
                          onChange={(e) => {
                            const value = e.currentTarget.value;
                            const parsed =
                              skillItemSchema.shape.seniority.safeParse(value);
                            if (parsed.success) {
                              field.setValue((v) => {
                                const newValue = v.with(i, {
                                  name: v[i]?.name,
                                  seniority: parsed.data,
                                });
                                return newValue;
                              });
                            }
                          }}
                        >
                          {v?.seniority === undefined && (
                            <option>Pick one</option>
                          )}
                          <option value="NiceToHave">Nice to have</option>
                          <option value="Junior">Junior</option>
                          <option value="Mid">Mid</option>
                          <option value="Senior">Senior</option>
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="border text-white rounded-md hover:bg-red-600 hover:cursor-pointer bg-red-500 p-4 relative"
                          onClick={() => field.removeValue(i)}
                        >
                          <span className="absolute top-1/2 translate-x-1/2 -translate-y-1/2 right-1/2">
                            X
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
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
