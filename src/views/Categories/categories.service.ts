import { Method } from "@learlifyweb/providers.https";

export const api = {
  categories: {
    method: Method.GET,
    baseURL: process.env.API,
    endpoint: "/api/v2/management/categories",
  },
  enrichment: {
    method: Method.POST,
    baseURL: process.env.API,
    endpoint: "/api/v2/ai/enrichment",
  },
  create: {
    method: Method.POST,
    baseURL: process.env.API,
    endpoint: "/api/v2/management/categories",
  },
  update: {
    method: Method.PUT,
    baseURL: process.env.API,
    endpoint: "/api/v2/management/categories",
  },
};

export enum CategoryQuery {
  FETCH = "FETCH_CATEGORY",
}
