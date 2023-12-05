import { Method } from "@learlifyweb/providers.https";

export const api = {
  createDraft: {
    method: Method.POST,
    baseURL: process.env.API,
    endpoint: "/api/v2/draft/courses",
  },
  findDraft: {
    method: Method.GET,
    baseURL: process.env.API,
    endpoint: "/api/v2/draft/courses",
  },
  findDrafts: {
    method: Method.GET,
    baseURL: process.env.API,
    endpoint: "/api/v2/draft/courses",
  },
};
