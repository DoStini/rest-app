import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import ROUTES from "./constants/Routes";

export const redirectNotFound = (router: AppRouterInstance) => {
  router.replace("/404");
};

export const redirectLogin = (router: AppRouterInstance) => {
  router.replace(ROUTES.API.AUTH.LOGIN);
};
