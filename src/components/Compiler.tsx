import React from "react";
import { Margin } from "@styles";
import { Control, Controller } from "react-hook-form";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactCodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";

import { Card } from "primereact/card";
import { Button } from "primereact/button";

import { styles } from "@root.styles";
import { InputSwitch } from "primereact/inputswitch";

type CompilerProps = {
  docs: string;
  title: string;
  enabled: boolean;
  control: Control;
  description: string;
  onSwitch: () => void;
  onSubmit: (event: React.FormEvent) => void;
};

const Compiler: React.FC<CompilerProps> = ({
  docs,
  title,
  control,
  enabled,
  onSubmit,
  onSwitch,
  description,
}) => {
  return (
    <div>
      <Card className="flex flex-col" title={title}>
        <p className="p-0 text-gray-400">{description}</p>
      </Card>
      <Margin>
        <hr />
      </Margin>
      <a href={docs} target="_blank" className="text-indigo-500 font-bold">
        Ver documentación de ({title})
      </a>
      <Margin>
        <form onSubmit={onSubmit}>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <ReactCodeMirror
                theme="light"
                extensions={ext}
                basicSetup={setup}
                value={field.value}
                onChange={(value) => field.onChange(value)}
              />
            )}
          ></Controller>
        </form>
      </Margin>
      <Margin>
        <div className={styles.flex}>
          <Button
            size="small"
            type="submit"
            severity="info"
            className="p-inputtext-sm"
            icon={
              <FontAwesomeIcon
                className={styles.fontAwesomeIcon}
                icon="terminal"
              />
            }
            tooltip="Comprueba la sintaxis, y la estructura de este JSON en particular."
          >
            Run
          </Button>
          <Button
            size="small"
            type="button"
            severity="help"
            className="p-inputtext-sm"
            icon={
              <FontAwesomeIcon
                className={styles.fontAwesomeIcon}
                icon="clipboard"
              />
            }
            tooltip="Genera un id único"
          >
            Clipboard UUID
          </Button>
          <InputSwitch
            checked={enabled}
            onChange={onSwitch}
            tooltip="Code Enabled. ¿Deseas activar la visualización de Interfaz Gráfica de Usuario?"
          />
        </div>
      </Margin>
    </div>
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

export default React.memo(Compiler);
