import React from "react";
import styled from "styled-components";

// - Editor
import SelectionSimpleEditor from "./SelectionSimple";

// - Playground
import { EditorType } from "../Playground/PlaygroundState";

// - Editor
import { useEditor } from "../../context/EditorHook";
import { Accordion, AccordionTab } from "primereact/accordion";

interface Props {
  mode: EditorType;
}

const Editor: React.FC<Props> = () => {
  /**
   * @description
   * Use the editor hook to connect action.
   */
  const control = useEditor();

  /**
   * @description
   * Filter by index.
   */
  const activeIndexToggled = React.useMemo(
    () => control.editor.filter((m) => m.toggled).map((m, index) => index),
    [control.editor]
  );

  return (
    <Accordion multiple activeIndex={activeIndexToggled}>
      {control.editor?.map((element, index) => (
        <AccordionTab key={element.uuid} header={`Material ${index + 1}`}>
          <UIContainer>
            {element.type === "SimpleSelection" && (
              <SelectionSimpleEditor
                index={index}
                status={element.toggled}
                correct={element?.correct}
                answers={element?.answers}
                question={element?.question}
                onCompile={(model) =>
                  control.onChangeEditorProperty({
                    kind: {
                      type: element.type,
                    },
                    data: {
                      toggled: true,
                      completed: true,
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
        </AccordionTab>
      ))}
    </Accordion>
  );
};

const UIContainer = styled.div`
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 15px;
`;

export default React.memo(Editor);
