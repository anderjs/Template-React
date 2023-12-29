import React from "react";

// - Editor
import SelectionSimpleEditor from "./SelectionSimple";

// - Playground
import { EditorType } from "../Playground/PlaygroundState";

interface Props {
  mode: EditorType;
}

const Editor: React.FC<Props> = ({ mode }) => {
  switch (mode) {
    case EditorType.SELECTION:
      return <SelectionSimpleEditor />;

    default:
      return <div />;
  }
};

export default Editor;
