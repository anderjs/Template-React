import { Node } from "@learlifyweb/providers.services";
import { IUser } from "@learlifyweb/providers.schema";
import { getName } from "@utils";

// - Types

export const render: Node<IUser>["data"] = {
  email: ({ email }) => email,
  first_name: ({ first_name, last_name }) => getName(first_name, last_name),
};
