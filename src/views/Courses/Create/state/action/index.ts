import { createAction } from "@reduxjs/toolkit";

import { ICategory, ITags, IUser } from "@learlifyweb/providers.schema";
import { IDraft } from "@views/Courses/courses.interface";

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

export const setInteractive = createAction("@courses/instructor/interact");

export const backStep = createAction("@courses/next/back");

export const nextStep = createAction("@courses/next/step");
