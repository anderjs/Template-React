import { createAction } from "@reduxjs/toolkit";
import { EditorType, IFlux } from "./PlaygroundState";

export const selectEditor = createAction(
  "select/editor",
  (payload: EditorType) => {
    return {
      payload,
    };
  }
);

export const setTriggerFlux = createAction(
  "set/trigger/flux",
  (payload: IFlux) => {
    return {
      payload,
    };
  }
);

export const createComponent = createAction(
  "create/component",
  (payload: React.ReactNode) => {
    return {
      payload,
    };
  }
);

export const createAnswer = createAction("create/answer", (payload: string) => {
  return {
    payload,
  };
});

export const setUpdateAnswer = createAction(
  "update/answer",
  (payload: { index: number; value: string }) => {
    return {
      payload,
    };
  }
);
