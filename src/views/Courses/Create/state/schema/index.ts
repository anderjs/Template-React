import { ISimpleSelection } from "@learlifyweb/providers.schema";

export type IEditorSimple = {
  type: "SimpleSelection";
  uuid: string;
  toggled: boolean;
  completed: boolean;
} & ISimpleSelection;

export type IEditorContext = IEditorSimple & {
  ref?: null;
};
