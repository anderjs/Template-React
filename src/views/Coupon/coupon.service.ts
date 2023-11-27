import { Method } from "@learlifyweb/providers.https";

export const service = {
  coupons: {
    baseURL: process.env.API,
    endpoint: "/api/v2/management/coupon",
    method: Method.GET,
  },
  create: {
    baseURL: process.env.API,
    endpoint: "/api/v2/management/coupon",
    method: Method.POST,
  },
  update: {
    baseURL: process.env.API,
    endpoint: "/api/v2/management/coupon",
    method: Method.PUT,
  },
  delete: {
    baseURL: process.env.API,
    endpoint: "/api/v2/management/coupon",
    method: Method.DELETE,
  },
};
