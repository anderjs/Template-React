import { Method } from "@learlifyweb/providers.https";

export const service = {
  roles: {
    baseURL: process.env.API,
    endpoint: "/api/v2/management/roles",
    method: Method.GET,
  },
};
