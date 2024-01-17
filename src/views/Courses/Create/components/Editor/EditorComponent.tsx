import React from "react";

// - Editor
import SelectionSimpleEditor from "./SelectionSimple";

// - Playground
import { EditorType } from "../Playground/PlaygroundState";

// - Editor
import { useEditor } from "../../context/EditorHook";

interface Props {
  mode: EditorType;
}

const Editor: React.FC<Props> = () => {
  /**
   * @description
   * Use the editor hook to connect action.
   */
  const control = useEditor();

  return (
    <>
      {control.editor?.map((element, index) => (
        <React.Fragment key={element.uuid}>
          {element.type === "SimpleSelection" && (
            <SelectionSimpleEditor
              index={index}
              correct={element?.correct}
              answers={element?.answers}
              question={element?.question}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default React.memo(Editor);
