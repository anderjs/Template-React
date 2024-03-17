import React from "react";
import styled from "styled-components";
import { classNames } from "primereact/utils";
import { useForm, Controller, useWatch } from "react-hook-form";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Draggable,
  Droppable,
  DropResult,
  DragDropContext,
} from "react-beautiful-dnd";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";

// - Styled
import { Card } from "primereact/card";
import { Fade } from "react-awesome-reveal";
import { MarginY } from "@views/Coupon/coupon.styles";

// - Prime
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { RadioButton } from "primereact/radiobutton";
import { confirmPopup } from "primereact/confirmpopup";

// - Playground
import { useCompile } from "@hooks/useCompile";
import { useEditor } from "../../context/EditorHook";
import usePlayground from "../Playground/PlaygroundHooks";

// - Styles
import { styles } from "@root.styles";

// - Utils
import { beautify } from "@utils";

// - Schema
import { IAnswer, ISimpleSelection } from "@learlifyweb/providers.schema";
import {
  SimpleSelectionProps,
  AbstractSimpleSelection,
} from "./SelectionSimpleTypes";

// - Schema
import { answerSchema, selectionSchema } from "./schemas/SelectionSimpleSchema";

const SelectionSimpleEditor: React.FC<SimpleSelectionProps> = ({
  index,
  answers,
  correct,
  question,
  onCompile,
}) => {
  const editor = useEditor();

  const playground = usePlayground();

  const [edit, setEdit] = React.useState<number>(-1);

  const [checked, setChecked] = React.useState<boolean>(false);

  const [codeMirror, setCodeMirror] = React.useState<boolean>(false);

  /**
   * @description
   * Simple selection usage Graphic User Interface.
   */
  const { control, reset, getValues } = useForm<ISimpleSelection>({
    defaultValues: {
      correct,
      question,
    },
  });

  const draft = useForm<ISimpleSelection>({});

  /**
   * @description
   * Compiled version into code.
   */
  const code = useForm<AbstractSimpleSelection>({
    defaultValues: {
      code: beautify({}),
    },
  });

  const [questionRef, correctRef] = useWatch({
    name: ["question", "correct"],
    control,
  });

  const { message, compile } = useCompile({
    onSuccess: () => {},
  });

  const input = React.useRef<HTMLInputElement>();

  const handleStageCreateAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    const handleSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();

      try {
        answerSchema.parse(input.current.value);

        editor.onAddNewAnswer({
          index: index,
          value: input.current.value,
          type: "SimpleSelection",
        });
      } catch (e) {
        message?.current?.show({
          severity: "error",
          detail: e?.message,
        });
      }

      input.current.value = "";
    };

    confirmPopup({
      target: e.currentTarget,
      message: (
        <form onSubmit={handleSubmit}>
          <InputText
            autoFocus
            ref={input}
            className="p-inputtext-sm"
            placeholder="Ingresar una respuesta"
          />
        </form>
      ),
      reject: () => reset(),
      accept: () => handleSubmit(),
      acceptLabel: "Agregar",
      rejectLabel: "Cancelar",
      rejectClassName: "p-button-danger",
      acceptClassName: "p-button-success",
    });
  };

  /**
   * @description
   * Before enable code mirror we should pass the current version of code.
   */
  const handleEnableCodeMirror = () => {
    const { correct, question } = getValues();
    /**
     * @description
     * Setted by the current values.
     */
    code.reset({
      code: beautify({
        answers,
        correct,
        question,
      }),
    });

    setCodeMirror(true);
  };

  /**
   * @description
   * Deletes the current answer selected.
   */
  const handleClickDeleteAnswer = React.useCallback(
    (value: IAnswer, index: number) => {
      editor.onDeleteAnswer({
        type: "SimpleSelection",
        index: index,
        value,
      });
    },
    [editor.onDeleteAnswer]
  );

  /**
   * @description
   * Disable code mirror to instance of Graphic User Interface.
   */
  const handleDisableCodeMirror = () => {
    setCodeMirror(false);
  };

  /**
   * @description
   * Compile syntax for CodeMirror instance.
   */
  const handleCompileCodeMirror = () => {};

  /**
   * @description
   * Insert the flux of a new component.
   */
  const handleInsertComponent = () => {
    compile(
      {
        answers,
        correct: correctRef,
        question: questionRef,
      },
      selectionSchema
    );
  };

  /**
   * @description
   * Insers the correct value to pick.
   */
  const handleSelectCorrectValue = React.useCallback(
    (value: number) => {
      editor.onSelectCorrect({
        index,
        value,
      });
    },
    [index, editor.onSelectCorrect]
  );

  /**
   * @description
   * Re order elements.
   */
  const handleDragElements = (drop: DropResult) => {
    editor.onDragAndDropAnswer({
      drop,
      index,
    });

    const { correct } = getValues();

    if (correct === drop.source.index) {
      editor.onSelectCorrect({
        index,
        value: drop.destination.index,
      });
    }
  };

  /**
   * @description
   * Enable checking to question.
   */
  const handleCheckEnable = () => {
    setChecked(true);
  };

  /**
   * @description
   * Disable checking to question.
   */
  const handleCheckDisable = () => {
    setChecked(false);
  };

  /**
   * @description
   * Edit draft answer.
   */
  const handleUpdateAnswer = React.useCallback(
    (answer: string, index: number) => {
      setEdit((draft) => {
        if (draft === index) {
          return draft;
        }

        return index;
      });

      draft.reset({
        question: answer,
      });
    },
    [draft.reset]
  );

  const handleCompleteUpdate = React.useCallback(
    (value: string, answer: number) => {
      editor.onUpdateAnswer({
        value,
        answer,
        index,
      });

      setEdit(-1);

      draft.reset();
    },
    [draft.reset, editor.onUpdateAnswer]
  );

  /**
   * @description
   * Enables VSCode Monaco on our Playground to Edit a JSON file.
   */
  if (codeMirror) {
    return (
      <>
        <Toast position="center" ref={message} />
        <Fade delay={0.1}>
          <Card className="flex flex-col" title="Selección Simple">
            <p className="p-0 text-gray-400">
              En selección simple (JSON) podrás editar el template del ejercicio
              sin necesidad de modificar nada en GUI. Utiliza los parámetros
              seleccionados para poder adjuntar todo lo que desees.
            </p>
            <hr className="my-4" />
            <a
              href="https://bit.cloud/learlifyweb/components/ui/selection"
              target="_blank"
              className="text-indigo-500 font-bold"
            >
              Ver documentación de (Selection Simple)
            </a>
            <MarginY />
            <Controller
              name="code"
              render={({ field }) => (
                <CodeMirror
                  theme="light"
                  extensions={ext}
                  basicSetup={setup}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              )}
              control={code.control}
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
                onClick={handleCompileCodeMirror}
                tooltip="Comprueba la sintaxis, y la estructura de este JSON en particular."
              >
                Compile
              </Button>
              <InputSwitch
                checked={codeMirror}
                onChange={handleDisableCodeMirror}
                tooltip="Code Enabled. ¿Deseas activar la visualización de Interfaz Gráfica de Usuario?"
              />
            </div>
          </Card>
        </Fade>
      </>
    );
  }

  /**
   * @description
   * Template to close elements.
   */
  const TemplateClose = () => {
    /**
     * @description
     * Handle to delete the current selection item.
     */
    const handleDeleteElement = () => {
      editor.onDeleteElement(index);
    };

    return (
      <div onClick={handleDeleteElement} className={styles.closeTemplate}>
        <FontAwesomeIcon
          icon="close"
          className={classNames(styles.fontAwesomeIcon, "text-red-500")}
        />
      </div>
    );
  };

  return (
    <>
      <Toast position="center" ref={message} />
      <Fade delay={0.1}>
        <Card title="Selección Simple" header={TemplateClose}>
          <p className="p-0 text-gray-400">
            En selección simple podrás elegir una pregunta, con una cantidad
            específicas de respuestas. Al momento de finalizar el workflow,
            harás click en la opción de "Insertar" y podrás mover el ejercicio
            en la dirección que gustes.
          </p>
          <MarginY />
          <div className={styles.start}>
            <div>
              <Controller
                name="question"
                control={control}
                render={({ field }) => (
                  <div className="p-inputgroup flex-1">
                    <InputText
                      id="question"
                      name="question"
                      value={field.value}
                      disabled={checked}
                      className="w-[400px]"
                      placeholder="Ingresa la pregunta.."
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <span className="p-inputgroup-addon">
                      <Checkbox
                        checked={checked}
                        onChange={
                          checked ? handleCheckDisable : handleCheckEnable
                        }
                      />
                    </span>
                  </div>
                )}
              />
            </div>
          </div>
          <MarginY />
          <div className={styles.start}>
            <Button
              size="small"
              severity="info"
              disabled={questionRef.length === 0}
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
                <FontAwesomeIcon
                  icon="code"
                  className={styles.fontAwesomeIcon}
                />
              }
              onClick={handleEnableCodeMirror}
            >
              Código
            </Button>
          </div>
          <MarginY />
          {answers?.length === 0 ? (
            <small className="text-gray-600">
              Agregar respuestas y preguntas para poder seleccionar la correcta.
            </small>
          ) : (
            <DragDropContext onDragEnd={handleDragElements}>
              <Droppable droppableId="answers">
                {(provided) => (
                  <SpacingX
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {answers?.map((answer, index) => (
                      <Draggable
                        key={answer.id}
                        index={index}
                        draggableId={answer.id}
                      >
                        {(provided) => (
                          <SpacingX
                            ref={provided.innerRef}
                            className="flex items-center"
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {edit === index ? (
                              <div
                                className={classNames(
                                  styles.elements,
                                  "w-[20rem]"
                                )}
                              >
                                <Controller
                                  name="question"
                                  control={draft.control}
                                  render={({ field }) => (
                                    <div>
                                      <div className="my-2">
                                        <span className="font-light text-sm text-slate-500">
                                          Actualización
                                        </span>
                                      </div>
                                      <div className="flex justify-start gap-x-2 items-center">
                                        <InputText
                                          autoFocus
                                          inputMode="text"
                                          className="p-inputtext-sm"
                                          placeholder="Ingresa tu nueva respuesta aquí"
                                          onChange={(e) =>
                                            field.onChange(e.target.value)
                                          }
                                          value={field.value}
                                        />
                                        <FontAwesomeIcon
                                          className={classNames(
                                            styles.fontAwesomeIcon,
                                            "hover:cursor-pointer",
                                            "text-indigo-500"
                                          )}
                                          icon="check"
                                          onClick={() =>
                                            handleCompleteUpdate(
                                              draft.getValues("question"),
                                              index
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  )}
                                />
                              </div>
                            ) : (
                              <>
                                <RadioButton
                                  value={answer.value}
                                  inputId={answer.id}
                                  onClick={() =>
                                    handleSelectCorrectValue(index)
                                  }
                                  onChange={() =>
                                    handleSelectCorrectValue(index)
                                  }
                                  checked={index === correctRef}
                                />
                                <div
                                  className={classNames(
                                    styles.elements,
                                    "w-[20rem]"
                                  )}
                                >
                                  <div>
                                    <label
                                      htmlFor={answer.id}
                                      className={styles.label}
                                    >
                                      {answer.value}
                                    </label>
                                  </div>
                                  <div className="flex justify-start gap-x-2 items-center">
                                    <FontAwesomeIcon
                                      className={classNames(
                                        styles.fontAwesomeIcon,
                                        "hover:cursor-pointer",
                                        "text-emerald-500"
                                      )}
                                      icon="pencil-alt"
                                      onClick={() =>
                                        handleUpdateAnswer(answer.value, index)
                                      }
                                    />
                                    <FontAwesomeIcon
                                      onClick={() =>
                                        handleClickDeleteAnswer(answer, index)
                                      }
                                      className={classNames(
                                        styles.fontAwesomeIcon,
                                        "hover:cursor-pointer",
                                        "text-red-500"
                                      )}
                                      icon="xmark"
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </SpacingX>
                        )}
                      </Draggable>
                    ))}
                  </SpacingX>
                )}
              </Droppable>
            </DragDropContext>
          )}
          <MarginY />
          <MarginY />
          <MarginY />
          <div className={styles.flex}>
            <Button
              severity="success"
              tooltip="Al momento de insertar, quedará ingresado el nuevo elemento"
              disabled={playground.answer.length === 0}
              icon={
                <FontAwesomeIcon
                  icon="gear"
                  className={styles.fontAwesomeIcon}
                />
              }
              onClick={handleInsertComponent}
            >
              Insertar
            </Button>
          </div>
        </Card>
      </Fade>
    </>
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

const SpacingX = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export default React.memo(SelectionSimpleEditor);
