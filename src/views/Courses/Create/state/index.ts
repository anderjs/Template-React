import { ICategory } from "@learlifyweb/providers.schema";
import { createReducer } from "@reduxjs/toolkit";
import { nextStep, selectCategory } from "./action";

interface IState {
  active: Step;
  category?: ICategory;
}

enum Step {
  CATEGORIES = 0,
}

const initialState: IState = {
  active: Step.CATEGORIES,
};

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(selectCategory, (state, action) => {
    state.category = action.payload;
  });

  builder.addCase(nextStep, (state) => {
    state.active += 1;
  });
});

export { Step, IState, reducer, initialState };
