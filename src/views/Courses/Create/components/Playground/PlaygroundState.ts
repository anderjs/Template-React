import { v4 } from "uuid";
import { createReducer } from "@reduxjs/toolkit";

import {
  createAnswer,
  createComponent,
  selectEditor,
  setTriggerFlux,
} from "./PlaygroundAction";

interface IBox {
  uuid: string;
  ref: React.ReactNode;
}

interface IAnswer {
  uuid: string;
  value: string;
}

export interface IFlux {
  uuid?: string;
  data?: any;
  key: EditorType;
  locX?: number;
  locY?: number;
}

export interface State {
  flux?: IFlux[];
  answer: IAnswer[];
  components: IBox[];
  editor?: EditorType;
}

export enum EditorType {
  ORDER = "order",
  SELECTION = "selection",
}

export const initialState: State = {
  flux: [],
  answer: [],
  components: [],
};

const playground = createReducer(initialState, (builder) => {
  /**
   * @description
   * Create answer.
   */
  builder.addCase(createAnswer, (state, action) => {
    state.answer.push({
      value: action.payload,
      uuid: v4(),
    });
  });

  /**
   * @description
   * Select editor action.
   */
  builder.addCase(selectEditor, (state, action) => {
    state.editor = action.payload;
  });

  /**
   * @description
   * Trigger up the flux.
   */
  builder.addCase(setTriggerFlux, (state, action) => {
    state.flux.push({
      ...action.payload,
      uuid: v4(),
    });

    state.editor = null;

    state.answer = [];
  });

  /**
   * @description
   * Creates a new component.
   */
  builder.addCase(createComponent, (state, action) => {
    state.components.push({
      ref: action.payload,
      uuid: v4(),
    });
  });
});

export default playground;
