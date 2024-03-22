import { ISimpleSelection } from "@learlifyweb/providers.schema";

export type IEditorSimple = {
  type: "SimpleSelection";
  uuid: string;
  toggled: boolean;
  completed: boolean;
} & ISimpleSelection;

export type IEditorListening = {
  type: "Listening";
  uuid: string;
  toggled: boolean;
  completed: boolean;
} & ISimpleSelection;

export type IEditorContext =
  | IEditorSimple
  | (IEditorListening & {
      ref?: null;
    });
