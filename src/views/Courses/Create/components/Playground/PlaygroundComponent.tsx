import React from "react";
import styled from "styled-components";

import { MarginY } from "@views/Coupon/coupon.styles";

import { Dialog } from "primereact/dialog";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import {
  FileUpload,
  FileUploadHeaderTemplateOptions,
} from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";

import { useFile } from "@hooks/useFile";

import { DndContext } from "@dnd-kit/core";

import { PrimeIcons } from "primereact/api";
import {
  cancelOptions,
  chooseOptions,
  emptyTemplate,
  itemTemplate,
  uploadOptions,
} from "@utils";
import { classNames } from "primereact/utils";

// - Reducer
import playground, { initialState } from "./PlaygroundState";

// - Editor
import Editor from "../Editor/EditorComponent";

// - Context
import { PlaygroundContext } from "./PlaygroundContext";

// - Hooks
import { useEditor } from "../../context/EditorHook";
import { v4 } from "uuid";

interface Props {
  active: boolean;
  onClose: () => void;
}

const Playground: React.FC<Props> = ({ active, onClose }) => {
  const file = React.useRef<FileUpload>();

  const { size, onTemplateSelect, onTemplateClear, onTemplateUpload } =
    useFile();

  const { editor, onSetNewElement } = useEditor();

  const [state, dispatch] = React.useReducer(playground, initialState);

  const [upload, setUpload] = React.useState(false);

  const visual = React.useMemo<MenuItem[]>(
    () => [
      {
        label: "Video",
        icon: PrimeIcons.VIDEO,
        items: [
          {
            label: "Subir",
            icon: PrimeIcons.CLOUD_UPLOAD,
            command: () => {
              setUpload(true);
            },
          },
        ],
      },
      {
        label: "Image",
        icon: PrimeIcons.IMAGE,
        items: [
          {
            label: "Subir",
            icon: PrimeIcons.CLOUD_UPLOAD,
            command: () => {
              setUpload(true);
            },
          },
        ],
      },
      {
        label: "Component",
        icon: PrimeIcons.BOX,
        items: [
          {
            label: "Selección Simple",
            icon: PrimeIcons.QUESTION_CIRCLE,
            command: () => {
              /**
               * @description
               * Set a new element in the editor.
               */
              onSetNewElement?.({
                uuid: v4(),
                correct: 0,
                answers: [],
                question: "",
                type: "SimpleSelection",
              });
            },
          },
        ],
      },
    ],
    []
  );

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;

    const value = size / 10000;

    const formatedValue = file.current ? file.current.formatSize(size) : "0 B";

    return (
      <div
        className={classNames(
          "flex",
          className,
          "bg-transparent",
          "items-center"
        )}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex items-center gap-5 ml-auto">
          <span>{formatedValue} / 0 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            className="w-[10rem] h-[12px]"
          />
        </div>
      </div>
    );
  };

  /**
   * @description
   * Playground value context.
   */
  const PlaygroundValueContext = React.useMemo(
    () => ({
      ...state,
      dispatch,
    }),
    [state]
  );

  return (
    <StyledDialog
      visible={active}
      onHide={onClose}
      header="Playground"
      closeOnEscape={false}
    >
      <Menubar model={visual} />
      <MarginY />
      <PlaygroundContext.Provider value={PlaygroundValueContext}>
        {editor?.length > 0 && <Editor mode={state.editor} />}
      </PlaygroundContext.Provider>
      {upload ? (
        <>
          <MarginY />
          <hr />
          <MarginY />
          <FileUpload
            multiple
            ref={file}
            onError={onTemplateClear}
            onClear={onTemplateClear}
            onSelect={onTemplateSelect}
            itemTemplate={itemTemplate}
            onUpload={onTemplateUpload}
            chooseOptions={chooseOptions}
            cancelOptions={cancelOptions}
            uploadOptions={uploadOptions}
            emptyTemplate={emptyTemplate}
            headerTemplate={headerTemplate}
          />
        </>
      ) : (
        <Container>
          <DndContext>
            {state.flux.map((component) => (
              <div key={component?.uuid}></div>
            ))}
          </DndContext>
        </Container>
      )}
    </StyledDialog>
  );
};

const StyledDialog = styled(Dialog)`
  width: -webkit-fill-available;
  padding: 10px;
  margin: 10px;
  height: 100vh;
`;

const Container = styled.div`
  padding: 100px;
`;

export default React.memo(Playground);
