import { IUser } from "@learlifyweb/providers.schema";

export type Search = Pick<IUser, "id" | "first_name" | "last_name" | "email">;
