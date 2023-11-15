import { Method } from "@learlifyweb/providers.https";

export const request = {
  coupons: {
    baseURL: process.env.API,
    endpoint: "/api/v2/coupons",
    method: Method.GET,
  },
  create: {
    baseURL: process.env.API,
    endpoint: "/api/v2/coupons",
    method: Method.POST,
  },
  update: {
    baseURL: process.env.API,
    endpoint: "/api/v2/coupons",
    method: Method.PUT,
  },
  delete: {
    baseURL: process.env.API,
    endpoint: "/api/v2/coupons",
    method: Method.DELETE,
  },
};
