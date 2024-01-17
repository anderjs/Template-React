import { ISimpleSelection } from "@learlifyweb/providers.schema";

export type IEditorSimple = {
  uuid: string;
  type: "SimpleSelection";
} & ISimpleSelection;

export type IEditorContext = IEditorSimple & {
  ref?: null;
};
