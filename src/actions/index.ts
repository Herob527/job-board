import login from "./auth/login";
import logout from "./auth/logout";
import register from "./auth/register";
import create from "./job-offer/create";

export const server = {
  login,
  logout,
  register,
  jobOffer: {
    create,
  },
};
