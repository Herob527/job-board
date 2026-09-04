import { ActionError, defineAction } from "astro:actions";
import bcrypt from "bcrypt";
import { registerSchema } from "#/features/auth/schema";

export default defineAction({
  input: registerSchema,
  handler: async (input, context) => {
    const { userService, companyService } = context.locals;

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const { user, isDuplicate, isUnknownError } = await userService.createUser(
      input,
      hashedPassword,
    );

    if (isDuplicate) {
      throw new ActionError({
        code: "CONFLICT",
        message: "Given user already exists",
      });
    }
    if (isUnknownError) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong when creating user",
      });
    }

    if (input.registerAs === "company") {
      const {
        company,
        isDuplicate: isDuplicateCompany,
        isUnknownError: isUnknownErrorCompany,
      } = await companyService.createCompany(
        {
          registrationLocation: input.registrationLocation,
          companyName: input.companyName,
        },
        user.id,
      );
      if (isDuplicateCompany) {
        throw new ActionError({
          code: "CONFLICT",
          message: "Given company already exists",
        });
      }

      if (isUnknownErrorCompany) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong when creating company",
        });
      }
      const { isUnknownError, isDuplicate } =
        await companyService.assignUserToCompany({
          userId: user.id,
          companyId: company.id,
          roles: ["company_admin"],
        });
      if (isDuplicate) {
        throw new ActionError({
          code: "CONFLICT",
          message: "Given user already exists withing company",
        });
      }
      if (isUnknownError) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong when assigning user to company",
        });
      }
      return { user, company };
    }
  },
});
