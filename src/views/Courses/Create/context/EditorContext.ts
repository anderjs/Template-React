import { createContext } from "react";
import { IAnswer } from "@learlifyweb/providers.schema";

import { IEditorContext } from "../state/schema";
import { DropResult } from "react-beautiful-dnd";

export type PushAnswerCallback = {
  type: IEditorContext["type"];
  index: number;
  value: string;
};

export type DeleteAnswerCallback = {
  type: IEditorContext["type"];
  index: number;
  value: IAnswer;
};

export type DragAndDropElements = {
  drop: DropResult;
  index: number;
};

export type CallbackValue = {
  index: number;
  value: string;
  answer: number;
};

export type SelectValue = {
  index: number;
  value: number;
};

export type EditorContextProps = {
  editor: Partial<IEditorContext>[];
  onDeleteElement?: (editor: number) => void;
  onSelectCorrect?: (args: SelectValue) => void;
  onUpdateAnswer?: (args: CallbackValue) => void;
  onAddNewAnswer?: (args: PushAnswerCallback) => void;
  onDeleteAnswer?: (args: DeleteAnswerCallback) => void;
  onSetNewElement?: (element: IEditorContext) => void;
  onDragAndDropAnswer?: (element: DragAndDropElements) => void;
  onChangeEditorProperty?: () => void;
};

export const EditorContext = createContext<EditorContextProps>({
  editor: [],
});
