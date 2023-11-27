import moment from "moment";
import { Node } from "@learlifyweb/providers.services";
import { IRoles } from "@learlifyweb/providers.schema";

// - Types

export const render: Node<IRoles>["data"] = {
  name: ({ name }) => name,
};
