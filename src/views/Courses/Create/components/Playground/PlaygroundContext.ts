import React from "react";
import { State } from "./PlaygroundState";

type Play = Partial<
  State & {
    dispatch: Function;
  }
>;

export const PlaygroundContext = React.createContext<Play>({});
