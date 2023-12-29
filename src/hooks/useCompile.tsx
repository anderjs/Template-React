import { z } from "zod";
import React from "react";
import { Toast } from "primereact/toast";

type UseCompileReturnType = {
  success: boolean;
  message: React.MutableRefObject<Toast>;
  compile: (text: string, schema: z.ZodTypeAny) => void;
};

export const useCompile = (): UseCompileReturnType => {
  const message = React.useRef<Toast>(null);

  const [success, setSuccess] = React.useState(false);

  const compile = React.useCallback((text: string, schema: z.ZodTypeAny) => {
    try {
      const json = JSON.parse(text);

      schema.parse(json);

      message.current?.show({
        severity: "success",
        summary: "Compile Success",
        detail: "JSON is valid.",
      });

      setSuccess(true);
    } catch (e) {
      setSuccess(false);

      if (e instanceof z.ZodError) {
        message.current?.show({
          sticky: true,
          severity: "error",
          summary: "Compile Error",
          detail: e.errors.map((error) => (
            <div key={error.message}>
              {error.path && <span>{error.path.join(".")}:</span>}
              <span>{error.message}</span>
              <br />
            </div>
          )),
        });
      } else {
        message.current?.show({
          sticky: true,
          severity: "error",
          summary: "Compile Error",
          detail: e.message,
        });
      }
    }
  }, []);

  return { success, message, compile };
};
