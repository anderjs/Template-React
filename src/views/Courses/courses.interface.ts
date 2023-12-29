import { Step } from "./Create/state";

export interface IDraft {
  _id: string;
  active?: Step;
  owner_id: number;
  status: "staging" | "publish";
  category: object;
  instructor: object;
  created_at: Date;
}
