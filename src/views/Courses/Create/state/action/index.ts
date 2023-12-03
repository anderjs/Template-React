import { createAction } from "@reduxjs/toolkit";

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

export const backStep = createAction("@courses/next/back");

export const nextStep = createAction("@courses/next/step");
