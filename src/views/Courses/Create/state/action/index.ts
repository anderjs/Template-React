// - Interface
import { IDraft } from "@views/Courses/courses.interface";

// - Redux
import { createAction } from "@reduxjs/toolkit";

// - Schemas
import { ICategory, ITags, IUser } from "@learlifyweb/providers.schema";

// - Schema Editor
import { IEditorContext, IEditorSimple } from "../schema";

// - Context Callback
import {
  CallbackValue,
  DeleteAnswerCallback,
  DragAndDropElements,
  PushAnswerCallback,
} from "../../context/EditorContext";

export const selectCategory = createAction(
  "@courses/select/category",
  (category: ICategory) => {
    return {
      payload: category,
    };
  }
);

export const selectInstructor = createAction(
  "@courses/select/instructor",
  (instructor: IUser) => {
    return {
      payload: instructor,
    };
  }
);

export const selectTag = createAction(
  "@courses/tags/select",
  (tag: Pick<ITags, "name" | "color">) => {
    return {
      payload: tag,
    };
  }
);

export const removeTag = createAction(
  "@courses/tags/remove",
  (tag: Pick<ITags, "name" | "color">) => {
    return {
      payload: tag,
    };
  }
);

/**
 * @description
 * Set the draft state.
 */
export const setDraftState = createAction(
  "@courses/draft/state",
  (draft: IDraft) => {
    return {
      payload: draft,
    };
  }
);

/**
 * @description
 * Draft update.
 */
export const setUpdateDraft = createAction("@courses/draft/update");

/**
 * @description
 * Create a new module.
 */
export const setNewModule = createAction(
  "@courses/draft/module",
  (title: string) => {
    return {
      payload: title,
    };
  }
);

/**
 * @description
 * Deleting a module.
 */
export const setDeleteModule = createAction(
  "@courses/module/delete",
  (id: number) => {
    return {
      payload: id,
    };
  }
);

/**
 * @description
 * Create a new module.
 */
export const setLessonModule = createAction(
  "@courses/module/addLesson",
  (idModule: number, title: string) => {
    return {
      payload: {
        title,
        id: idModule,
      },
    };
  }
);

/**
 * @description
 * Goes back.
 */
export const backStep = createAction("@courses/next/back");

/**
 * @description
 * Goes next.
 */
export const nextStep = createAction("@courses/next/step");

/**
 * @description
 * Set as an interactive course.
 */
export const setInteractive = createAction("@courses/instructor/interact");

/**
 * @description
 * Set editor edit.
 */
export const setEditorProperty = createAction(
  "@courses/editor/edit",
  (payload: EditProperty) => {
    return {
      payload,
    };
  }
);

export const setPushNewElement = createAction(
  "@courses/editor/element",
  (payload: IEditorContext) => {
    return {
      payload,
    };
  }
);

export const setAnswerElement = createAction(
  "@courses/editor/answer/create",
  (payload: PushAnswerCallback) => {
    return {
      payload,
    };
  }
);

export const setDeleteAnswer = createAction(
  "@courses/editor/answer/delete",
  (payload: DeleteAnswerCallback) => {
    return {
      payload,
    };
  }
);

export const setDragAndDropAnswers = createAction(
  "@courses/editor/answer/dnd",
  (payload: DragAndDropElements) => {
    return {
      payload,
    };
  }
);

export const setDeleteElement = createAction(
  "@courses/editor/delete/element",
  (payload: number) => {
    return {
      payload,
    };
  }
);

export const setCorrectAnswer = createAction(
  "@courses/editor/correct/answer",
  (payload: { index: number; value: number }) => {
    return {
      payload,
    };
  }
);

export const setUpdateAnswer = createAction(
  "@courses/editor/update/answer",
  (payload: CallbackValue) => {
    return {
      payload,
    };
  }
);

export const setCompileEditor = createAction(
  "@courses/editor/compile",
  (payload: EditProperty) => {
    return {
      payload,
    };
  }
);

export type EditProperty = {
  data: Omit<IEditorContext, "type">;
  kind: Pick<IEditorContext, "type">;
  index: number;
};
