import React from "react";
import styled from "styled-components";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { useForm, Controller, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";

// - Styled
import { Card } from "primereact/card";
import { Fade } from "react-awesome-reveal";
import { MarginY } from "@views/Coupon/coupon.styles";

// - Prime
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { confirmPopup } from "primereact/confirmpopup";

// - Playground
import { useCompile } from "@hooks/useCompile";
import usePlayground from "../Playground/PlaygroundHooks";

// - Styles
import { styles } from "@root.styles";

// - Action
import { createAnswer, setTriggerFlux } from "../Playground/PlaygroundAction";

// - Utils
import { beautify } from "@utils";

// - Schema
import { selectionSchema as schema } from "./schemas/SelectionSimpleSchema";

// - Type
import { EditorType } from "../Playground/PlaygroundState";

const SelectionSimpleEditor: React.FC = () => {
  const playground = usePlayground();

  const { message, compile } = useCompile();

  const [editor, setEditor] = React.useState<boolean>(false);

  const { control, getValues, setValue, reset } = useForm<IEditorSelection>({
    defaultValues: {
      json: beautify({
        answers: [],
        correct: 0,
        question: "",
      }),
    },
  });

  const [correct, question] = useWatch({
    name: ["correct", "question"],
    control,
  });

  const input = React.useRef<HTMLInputElement>();

  const handleAddAnswer = ({ answer }: IEditorSelection) => {
    reset();

    playground.dispatch(createAnswer(answer));
  };

  const handleStageCreateAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: e.currentTarget,
      message: (
        <Controller
          name="answer"
          control={control}
          render={({ field }) => (
            <InputText
              autoFocus
              ref={input}
              value={field.value}
              className="p-inputtext-sm"
              placeholder="Ingresar una respuesta"
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      ),
      accept: () => {
        handleAddAnswer(getValues());
      },
      reject: () => {
        reset();
      },
      acceptLabel: "Agregar",
      rejectLabel: "Cancelar",
      rejectClassName: "p-button-danger",
      acceptClassName: "p-button-success",
    });
  };

  const handleEnableVSCode = () => {
    setEditor(true);
  };

  const handleDisableVSCode = () => {
    setEditor(false);
  };

  const handleCompile = () => {
    const value = getValues("json");

    return compile(value, schema);
  };

  /**
   * @description
   * Insert the flux of a new component.
   */
  const handleInsertComponent = () => {
    playground.dispatch(
      setTriggerFlux({
        key: EditorType.SELECTION,
        locX: null,
        locY: null,
        data: {
          correct,
          question,
          answers: playground.answer,
        },
      })
    );
  };

  /**
   * @description
   * Insers the correct value to pick.
   */
  const handleSelectCorrectValue = React.useCallback((index: number) => {
    setValue("correct", index);
  }, []);

  /**
   * @description
   * Enables VSCode Monaco on our Playground to Edit a JSON file.
   */
  if (editor) {
    return (
      <>
        <Toast position="center" ref={message} />
        <Fade delay={0.1}>
          <Card title="Selección Simple">
            <p className="p-0 text-gray-400">
              En selección simple (JSON) podrás editar el template del ejercicio
              sin necesidad de modificar nada en GUI. Utiliza los parámetros
              seleccionados para poder adjuntar todo lo que desees.
            </p>
            <MarginY />
            <Controller
              name="json"
              control={control}
              render={({ field }) => (
                <CodeMirror
                  extensions={ext}
                  theme="light"
                  value={field.value}
                  basicSetup={setup}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
            <MarginY />
            <div className={styles.flex}>
              <Button
                severity="info"
                className="p-inputtext-sm"
                icon={
                  <FontAwesomeIcon
                    className={styles.fontAwesomeIcon}
                    icon="terminal"
                  />
                }
                onClick={handleCompile}
                tooltip="Comprueba la sintaxis, y la estructura de este JSON en particular."
              >
                Compile
              </Button>
              <InputSwitch
                checked={editor}
                onChange={handleDisableVSCode}
                tooltip="Code Enabled. ¿Deseas activar la visualización de Interfaz Gráfica de Usuario?"
              />
            </div>
          </Card>
        </Fade>
      </>
    );
  }

  return (
    <Fade delay={0.1}>
      <Card title="Selección Simple">
        <p className="p-0 text-gray-400">
          En selección simple podrás elegir una pregunta, con una cantidad
          específicas de respuestas. Al momento de finalizar el workflow, harás
          click en la opción de "Insertar" y podrás mover el ejercicio en la
          dirección que gustes.
        </p>
        <MarginY />
        <div className="flex justify-start gap-4 items-center">
          <div>
            <Controller
              name="question"
              control={control}
              render={({ field }) => (
                <InputText
                  id="question"
                  name="question"
                  value={field.value}
                  placeholder="Ingresa la pregunta.."
                />
              )}
            />
          </div>
          <Button
            size="small"
            severity="info"
            icon={
              <FontAwesomeIcon
                icon="plus-circle"
                className={styles.fontAwesomeIcon}
              />
            }
            onClick={handleStageCreateAnswer}
          >
            Respuesta
          </Button>
          <Button
            size="small"
            severity="help"
            tooltip="Permite editar el ejercicio en versión código"
            icon={
              <FontAwesomeIcon icon="code" className={styles.fontAwesomeIcon} />
            }
            onClick={handleEnableVSCode}
          >
            Código
          </Button>
        </div>
        <MarginY />
        {playground.answer.length === 0 ? (
          <small className="text-gray-600">
            Agregar respuestas y preguntas para poder seleccionar la correcta.
          </small>
        ) : (
          playground.answer.map((answer, index) => (
            <React.Fragment key={answer.uuid}>
              <div className="flex items-center">
                <RadioButton
                  value={answer.value}
                  inputId={answer.uuid}
                  checked={index === correct}
                  onChange={() => handleSelectCorrectValue(index)}
                />
                <label htmlFor={answer.uuid} className={styles.label}>
                  {answer.value}
                </label>
              </div>
              <SpacingX />
            </React.Fragment>
          ))
        )}
        <MarginY />
        <div className={styles.flex}>
          <Button
            severity="success"
            disabled={playground.answer.length === 0}
            tooltip="Al momento de insertar, quedará ingresado el nuevo elemento"
            icon={
              <FontAwesomeIcon icon="gear" className={styles.fontAwesomeIcon} />
            }
            onClick={handleInsertComponent}
          >
            Insertar
          </Button>
        </div>
      </Card>
    </Fade>
  );
};

const ext = [loadLanguage("json")];

const setup: ReactCodeMirrorProps["basicSetup"] = {
  highlightActiveLineGutter: true,
  highlightActiveLine: true,
  syntaxHighlighting: true,
  lineNumbers: true,
  lintKeymap: true,
};

interface IEditorSelection {
  json: string;
  answer: string;
  correct: number;
  question: string;
}

const SpacingX = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export default SelectionSimpleEditor;
