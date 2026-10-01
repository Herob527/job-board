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

    const company = await companyService.getCompanyById(input.companyId);
    if (!company) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Company not found",
      });
    }
    const isOwner = company.ownerId === user.id;
    const isAdmin = user.roles.includes("platform_admin");
    const isCorporate = user.roles.includes("corporate");

    const canCreate = [isOwner, isCorporate, isAdmin].some(Boolean);

    if (!canCreate) {
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
