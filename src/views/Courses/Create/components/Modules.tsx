import React from "react";
import { IState } from "../state";
import { useForm, Controller } from "react-hook-form";
import { IModule } from "@learlifyweb/providers.schema";

// - Styles
import styled from "styled-components";
import { MarginY } from "@views/Coupon/coupon.styles";

// - Prime
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { InputText } from "primereact/inputtext";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"; // To use <ConfirmPopup> tag
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import Module from "./Module";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classNames } from "primereact/utils";
import { PrimeIcons } from "primereact/api";
import { Fade } from "react-awesome-reveal";
import { TextLabel } from "@styles";
import { Title } from "@views/Admin/admin.style";
import { FormControl } from "@views/Settings/settings.styles";
import { useTimeoutState } from "@hooks/useTimeoutState";

interface Props {
  data: IState["modules"];
  onAddLesson?: (view: number, title: string) => void;
  onAddModule?: (title: string) => void;
  onDeleteModule?: (id: number) => void;
  interactive?: IState["interactive"];
}

const Modules: React.FC<Props> = ({
  data,
  interactive,
  onAddModule,
  onAddLesson,
  onDeleteModule,
}) => {
  const message = React.useRef<Toast>();

  const { control, formState, reset, getValues } =
    useForm<Pick<IModule, "title">>();

  const [view, setView] = React.useState<number>();

  const [open, setOpen] = useTimeoutState(true);

  /**
   * @description
   * Resets the current dialog.
   */
  const addModuleHandler = (e?: React.FormEvent) => {
    if (e && "preventDefault" in e) {
      e?.preventDefault();
    }

    if (getValues("title")) {
      onAddModule?.(getValues("title"));

      reset();
    }

    setOpen();
  };

  const handleConfirmModule = (event: React.MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      dismissable: true,
      target: event.currentTarget,
      message: (
        <FormControl onSubmit={addModuleHandler}>
          <TextLabel className="text-text-gray-300" htmlFor="module">
            Nombre
          </TextLabel>
          <Controller
            name="title"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <InputText
                id="module"
                name="module"
                className={classNames(formState.errors.title && "p-invalid")}
                value={field.value}
                placeholder="IELTS - Speaking"
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
        </FormControl>
      ),
      reject: reset,
      accept: addModuleHandler,
      closeOnEscape: true,
      acceptLabel: "Agregar",
      rejectLabel: "Cancelar",
      rejectClassName: "p-button-danger",
      acceptClassName: "p-button-success",
    });
  };

  const handleConfirmDeleteModule = React.useCallback(
    (id: number) => {
      confirmDialog({
        header: "Eliminar",
        message: "¿Estás seguro de eliminar este módulo?",
        icon: PrimeIcons.EXCLAMATION_TRIANGLE,
        acceptLabel: "Sí, eliminar",
        acceptClassName: "p-button-danger",
        rejectClassName: "p-button-info",
        accept: () => {
          onDeleteModule?.(id);

          message?.current?.show({
            severity: "success",
            summary: "Eliminación",
            detail: "Se ha eliminado un módulo",
          });
        },
      });
    },
    [onDeleteModule]
  );

  /**
   * @description
   * Show details and configuration of a module.
   */
  const handleClickModule = React.useCallback(
    (ref: number) => {
      const moduleIndex = data.findIndex((m) => m.id === ref);

      setView(moduleIndex);
    },
    [data]
  );

  const handleClickLesson = (title: string) => {
    onAddLesson?.(view, title);
  };

  const itemTemplate = (item: IModule) => {
    return (
      <div className="grid col-12">
        <ModuleViewer>
          <div className="text-bold text-900 text-[#ada8a8] text-xl">
            {item.title}
          </div>
          <ModuleActions>
            <Button
              size="small"
              severity="info"
              onClick={() => handleClickModule(item.id)}
              icon={<FontAwesomeIcon size="lg" icon="sliders" />}
            />
            <Button
              size="small"
              severity="danger"
              onClick={() => handleConfirmDeleteModule(item.id)}
              icon={<FontAwesomeIcon size="lg" icon="trash-alt" />}
            />
          </ModuleActions>
        </ModuleViewer>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Toast position="bottom-right" ref={message} />
      {open && <ConfirmPopup />}
      {open && <ConfirmDialog />}
      {data.length === 0 ? (
        <div>
          <p className="text-base">
            Crea un módulo para comenzar a generar contenido.
          </p>
          <MarginY />
          <Button
            severity="info"
            onClick={handleConfirmModule}
            icon={<FontAwesomeIcon className="mr-2" size="sm" icon="plus" />}
          >
            Agregar Módulo
          </Button>
        </div>
      ) : (
        <>
          {typeof view === "number" || (
            <>
              <Button
                severity="info"
                onClick={handleConfirmModule}
                icon={
                  <FontAwesomeIcon className="mr-2" size="sm" icon="plus" />
                }
              >
                Agregar Módulo
              </Button>
              <MarginY />
            </>
          )}
          {typeof view === "number" ? (
            <Fade delay={0.1}>
              <Title className="font-bold text-bg-black-alpha-50">
                Módulo: {data[view]?.title}
              </Title>
              <hr />
              <MarginY />
              <Module
                selected={view}
                lessons={data[view]?.lessons}
                onAddContent={handleClickLesson}
              />
            </Fade>
          ) : (
            <DataView
              paginator
              rows={20}
              value={data}
              itemTemplate={itemTemplate}
            />
          )}
        </>
      )}
    </React.Fragment>
  );
};

const ModuleViewer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const ModuleActions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

Modules.defaultProps = {
  data: [],
  interactive: false,
};

export default React.memo(Modules);
