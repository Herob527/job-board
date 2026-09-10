import { actions } from "astro:actions";
import { useForm } from "@tanstack/preact-form";
import { useMutation } from "@tanstack/preact-query";
import type z from "zod";
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
  const formHandler = useForm({
    validators: { onChange: jobSchema },
    onSubmit: (data) => mutate({ ...data.value, companyId }),

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
      Job offer
    </form>
  );
};

export default withQuery(CreateJobOffer);
