import { createReducer } from "@reduxjs/toolkit";
import { TreeSelectSelectionKeysType } from "primereact/treeselect";

import { selectUser, selectProfessor, selectRole } from "./admin.action";
import { Role } from "@learlifyweb/providers.schema";

export const initialState: State = {
  users: {},
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

  /**
   * @description
   * Select a role.
   */
  builder.addCase(selectRole, (state, action) => {
    state.role = action.payload;
  });
});

export interface State {
  role?: Role;
  users: TreeSelectSelectionKeysType;
}
