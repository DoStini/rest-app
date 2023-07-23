import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export const redirectNotFound = (router: AppRouterInstance) => {
  router.replace("/404");
};
