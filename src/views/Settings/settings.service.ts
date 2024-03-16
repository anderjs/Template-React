import { Method } from "@learlifyweb/providers.https";

export const service = {
  update: {
    method: Method.POST,
    baseURL: process.env.API,
    endpoint: "/api/v2/authentication/update",
  },
  photo: {
    method: Method.PUT,
    baseURL: process.env.API,
    endpoint: "/api/v2/users/photo",
  },
  discard: {
    method: Method.DELETE,
    baseURL: process.env.API,
    endpoint: "/api/v2/users/photo",
  },
  languages: {
    method: Method.GET,
    baseURL: "https://api.simplelocalize.io",
    endpoint: "/api/v1/languages",
  },
};
