import {
  ICategory,
  ICourse,
  ITags,
  IUser,
} from "@learlifyweb/providers.schema";
import { createReducer } from "@reduxjs/toolkit";

import {
  backStep,
  nextStep,
  removeTag,
  selectCategory,
  selectInstructor,
  selectTag,
} from "./action";

interface IState {
  active: Step;
  names: string[];
  tags: Pick<ITags, "name" | "color">[];
  instructor?: IUser;
  category?: ICategory;
  course?: Pick<ICourse, "title" | "description">;
}

enum Step {
  CATEGORIES = 0,
  INSTRUCTOR = 1,
  COURSES = 2,
}

const initialState: IState = {
  active: Step.COURSES,
  tags: [],
  names: [],
};

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(selectCategory, (state, action) => {
    state.category = action.payload;
  });

  builder.addCase(selectInstructor, (state, action) => {
    state.instructor = action.payload;
  });

  builder.addCase(selectTag, (state, action) => {
    const value = action.payload.name.toUpperCase();

    if (state.tags.length < 10 && !state.names.includes(value)) {
      state.tags.push(action.payload);

      state.names.push(value);
    }
  });

  builder.addCase(removeTag, (state, action) => {
    state.tags = state.tags.filter((tag) => tag.name !== action.payload.name);
  });

  builder.addCase(nextStep, (state) => {
    state.active += 1;
  });

  builder.addCase(backStep, (state) => {
    state.active -= 1;
  });
});

export { Step, IState, reducer, initialState };
