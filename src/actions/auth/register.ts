import { ActionError, defineAction } from "astro:actions";
import bcrypt from "bcrypt";
import { registerSchema } from "#/features/auth/schema";

export default defineAction({
  input: registerSchema,
  handler: async (input, context) => {
    const { userService, companyService, jwtService } = context.locals;

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
          roles: ["owner"],
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

      const { password, ...rest } = user;

      const passwordMatch = await bcrypt.compare(input.password, password);
      if (!passwordMatch) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "User not found or password is incorrect",
        });
      }
      const token = await jwtService.generateJwt(rest);

      context.cookies.set("Authorization", token, {
        httpOnly: true,
        path: "/",
        maxAge: 3600 * 24,
      });
      return { user, company };
    }
  },
});
