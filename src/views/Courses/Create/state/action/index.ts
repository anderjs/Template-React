// - Interface
import { IDraft } from "@views/Courses/courses.interface";

// - Redux
import { createAction } from "@reduxjs/toolkit";

// - Schemas
import { ICategory, ITags, IUser } from "@learlifyweb/providers.schema";

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

export const setDraftState = createAction(
  "@courses/draft/state",
  (draft: IDraft) => {
    return {
      payload: draft,
    };
  }
);

export const setUpdateDraft = createAction("@courses/draft/update");

export const setNewModule = createAction(
  "@courses/draft/module",
  (title: string) => {
    return {
      payload: title,
    };
  }
);

export const setDeleteModule = createAction(
  "@courses/module/delete",
  (id: number) => {
    return {
      payload: id,
    };
  }
);

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

export const backStep = createAction("@courses/next/back");

export const nextStep = createAction("@courses/next/step");

export const setInteractive = createAction("@courses/instructor/interact");
