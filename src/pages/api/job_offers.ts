import type { APIRoute } from "astro";
import z from "zod";

const paramsSchema = z.object({
  page: z.coerce.number().nonnegative(),
  pageSize: z.coerce.number().nonnegative(),
});

export const GET = (async ({ params, locals, url }) => {
  const { jobOfferService } = locals;
  const { data, error } = paramsSchema.safeParse(url.searchParams);
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
