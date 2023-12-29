import { useContext } from "react";
import { PlaygroundContext } from "./PlaygroundContext";

export default function usePlayground() {
  const state = useContext(PlaygroundContext);

  return state;
}
