import { createReducer } from "@reduxjs/toolkit";
import { selectUser } from "./actions";
import { TreeSelectSelectionKeysType } from "primereact/treeselect";

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
