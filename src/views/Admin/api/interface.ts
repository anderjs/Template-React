import { IUser } from "@learlifyweb/providers.schema";

export type ISearch = Pick<IUser, "id" | "first_name" | "last_name" | "email">;
