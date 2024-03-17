import React from "react";
import styled from "styled-components";

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
        <UIContainer key={element.uuid}>
          {element.type === "SimpleSelection" && (
            <SelectionSimpleEditor
              index={index}
              correct={element?.correct}
              answers={element?.answers}
              question={element?.question}
              onCompile={(model) =>
                control.onChangeEditorProperty({
                  kind: {
                    type: element.type,
                  },
                  data: {
                    uuid: element.uuid,
                    correct: model.correct,
                    answers: model.answers,
                    question: model.question,
                  },
                  index,
                })
              }
            />
          )}
        </UIContainer>
      ))}
    </>
  );
};

const UIContainer = styled.div`
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 15px;
`;

export default React.memo(Editor);
