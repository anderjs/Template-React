import React from "react";
import { Controller, useForm } from "react-hook-form";

// - Prime
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { confirmPopup } from "primereact/confirmpopup";
import { Accordion, AccordionTab } from "primereact/accordion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ILesson } from "@learlifyweb/providers.schema";
import { MarginY } from "@views/Coupon/coupon.styles";
import { styles } from "@root.styles";

import { classNames } from "primereact/utils";
import Playground from "./Playground/PlaygroundComponent";

interface Props {
  lessons?: ILesson[];
  selected?: number;
  onAddContent: (title: string) => void;
}

const Module: React.FC<Props> = ({ selected, lessons, onAddContent }) => {
  const [mode, setMode] = React.useState<boolean>(false);

  const { control, formState, reset, getValues } = useForm<ILesson>();

  const handleClickAddLesson = (event: React.MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: event.currentTarget,
      message: (
        <div>
          <label className="text-text-gray-300" htmlFor="lesson">
            Título
          </label>
          <br />
          <div>
            <Controller
              name="title"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <InputText
                  id="lesson"
                  name="lesson"
                  value={field.value}
                  placeholder="Phrasal Verbs.."
                  onChange={(e) => field.onChange(e.target.value)}
                  className={classNames(formState.errors.title && "p-invalid")}
                />
              )}
            />
          </div>
        </div>
      ),
      accept: () => {
        if (getValues("title")) {
          onAddContent?.(getValues("title"));
        }
      },
      reject: reset,
      acceptLabel: "Agregar",
      rejectLabel: "Cancelar",
      rejectClassName: "p-button-danger",
      acceptClassName: "p-button-success",
    });
  };

  const handleOpenViewMode = () => {
    setMode(true);
  };

  const handleCancelViewMode = () => {
    setMode(false);
  };

  return (
    <>
      <Playground active={mode} onClose={handleCancelViewMode} />
      <Button
        severity="info"
        onClick={handleClickAddLesson}
        icon={
          <FontAwesomeIcon
            className={styles.fontAwesomeIcon}
            icon="spell-check"
          />
        }
      >
        Agregar Material
      </Button>
      <MarginY />
      {lessons?.length === 0 ? (
        <small className="text-black-alpha-50">
          Agregar material para empezar a configurar el contenido de este
          módulo.
        </small>
      ) : (
        <Accordion>
          {lessons.map((lesson) => (
            <AccordionTab header={lesson?.title} key={lesson?.id}>
              <div>
                <Button
                  icon={
                    <FontAwesomeIcon
                      className={styles.fontAwesomeIcon}
                      icon="play"
                    />
                  }
                  severity="secondary"
                  onClick={handleOpenViewMode}
                >
                  Playground
                </Button>
              </div>
            </AccordionTab>
          ))}
        </Accordion>
      )}
    </>
  );
};

export default React.memo(Module);
