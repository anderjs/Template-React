import { ISimpleSelection } from "@learlifyweb/providers.schema";

export type CodeMirrorSimpleSelection = {
  json: ISimpleSelection;
};

export type SimpleSelectionProps = ISimpleSelection & {
  index: number;
  onCompile?: (model: ISimpleSelection) => void;
  onAddAnswer?: (model: string) => void;
};

export type AbstractSimpleSelection = {
  code: string;
};
