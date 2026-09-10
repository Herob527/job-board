import jobSchema from "#/features/job-offer/create/schema";
import { ActionError, defineAction } from "astro:actions";
import z from "zod";

export default defineAction({
  input: jobSchema.extend({ companyId: z.string() }),
  handler: async (input, { locals }) => {
    const { user, companyService } = locals;
    if (!user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "You are not logged in",
      });
    }
    const isAdmin = user.roles.includes("platform_admin");
    const isCorporate = user.roles.includes("corporate");
    if (!isAdmin && !isCorporate) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You are not permitted to create job listing",
      });
    }
    const companyWorker = await companyService.getCompanyWorker(
      user.id,
      input.companyId,
    );

    if (!companyWorker) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You are not permitted to create job listing for this company",
      });
    }

    companyService.createJobOffer(input);
  },
});
