import { createAction } from "@reduxjs/toolkit";
import { TreeSelectSelectionKeysType } from "primereact/treeselect";

export const selectUser = createAction(
  "@select/user",
  (user: TreeSelectSelectionKeysType) => ({
    payload: user,
  })
);

export const selectProfessor = createAction(
  "@select/teacher",
  (user: TreeSelectSelectionKeysType) => ({
    payload: user,
  })
);
