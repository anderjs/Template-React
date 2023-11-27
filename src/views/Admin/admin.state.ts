import { createReducer } from "@reduxjs/toolkit";
import { TreeSelectSelectionKeysType } from "primereact/treeselect";

import { selectUser, selectProfessor } from "./admin.action";

export const initialState: State = {
  user: {
    page: 1,
    search: "",
  },
  professor: {
    page: 1,
    search: "",
  },
  users: null,
  professors: null,
};

/**
 * @description
 * Defining reducer for management the state of admin.
 */
export const reducer = createReducer<State>(initialState, (builder) => {
  /**
   * @description
   * Select an user in the checkbox.
   */
  builder.addCase(selectUser, (state, action) => {
    state.users = action.payload;
  });

  builder.addCase(selectProfessor, (state, action) => {
    state.professors = action.payload;
  });
});

interface IPaginator {
  page: number;
  search: string;
}

export interface State {
  user: IPaginator;
  professor: IPaginator;
  users: TreeSelectSelectionKeysType;
  professors: TreeSelectSelectionKeysType;
}
