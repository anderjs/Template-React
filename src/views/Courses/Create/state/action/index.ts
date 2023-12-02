import { createAction } from "@reduxjs/toolkit";

import { ICategory } from "@learlifyweb/providers.schema";

export const selectCategory = createAction(
  "@courses/select/category",
  (category: ICategory) => {
    return {
      payload: category,
    };
  }
);

export const nextStep = createAction("@courses/next/step");
