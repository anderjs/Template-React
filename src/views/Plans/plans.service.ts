import { Method } from "@learlifyweb/providers.https";

export const api = {
  plans: {
    method: Method.GET,
    baseURL: process.env.API,
    endpoint: "/api/v2/management/plans",
  },
  delete: {
    method: Method.DELETE,
    baseURL: process.env.API,
    endpoint: "/api/v2/management/plans",
  },
  create: {
    method: Method.POST,
    baseURL: process.env.API,
    endpoint: "/api/v2/management/plans",
  },
};

export enum PlanMutation {
  CREATE = "CREATE_PLAN",
}

export enum PlanQuery {
  GET = "GET_PLAN",
}
