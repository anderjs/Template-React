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

export type EditorContextProps = {
  editor: Partial<IEditorContext>[];
  onChangeEditorProperty?: () => void;
  onSetNewElement?: (element: IEditorContext) => void;
  onAddNewAnswer?: (args: PushAnswerCallback) => void;
  onDeleteAnswer?: (args: DeleteAnswerCallback) => void;
  onDragAndDropAnswer?: (element: DragAndDropElements) => void;
};

export const EditorContext = createContext<EditorContextProps>({
  editor: [],
});
