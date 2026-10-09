import type { APIRoute } from "astro";
import z from "zod";
import type JobOfferService from "#/utils/JobOfferService";

const paramsSchema = z.object({
  page: z.number().nonnegative(),
  pageSize: z.number().nonnegative(),
});

export interface JobOffersEndpoint {
  GET: {
    params: z.infer<typeof paramsSchema>;
    response: Awaited<ReturnType<JobOfferService["getJobOffersPaginated"]>>;
  };
}

export const GET = (async ({ params, locals }) => {
  const { jobOfferService } = locals;
  const { data, error } = paramsSchema.safeParse(params);
  if (error) {
    return new Response(error.message, {
      status: 400,
      statusText: "Bad request",
    });
  }

  const { page, pageSize } = data;
  const jobOffers = await jobOfferService.getJobOffersPaginated(page, pageSize);
  return new Response(JSON.stringify(jobOffers), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}) satisfies APIRoute;
