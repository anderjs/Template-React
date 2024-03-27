import moment from "moment";
import { IDraft } from "./courses.interface";
import { Node } from "@learlifyweb/providers.services";

// - Types

export const render: Node<IDraft>["data"] = {
  _id: ({ _id }) => _id,
  status: ({ status }) => status,
  created_at: ({ created_at }) =>
    moment(created_at).format("(DD/MM/YYYY) HH:mm a"),
};

export const draft = {
  instructor: {
    id: null,
    first_name: null,
  },
  category: {
    id: null,
    name: null,
  },
  tags: [],
};
