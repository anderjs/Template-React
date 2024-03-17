import { z } from "zod";
import React from "react";
import { Toast } from "primereact/toast";

type UseCompileReturnType = {
  success: boolean;
  message: React.MutableRefObject<Toast>;
  compile: (text: string | object, schema: z.ZodTypeAny) => void;
};

type UseCompileCallbacks<T> = Partial<{
  onSuccess?: (data: T) => void;
}>;

export const useCompile = <T extends object>({
  onSuccess,
}: UseCompileCallbacks<T>): UseCompileReturnType => {
  const message = React.useRef<Toast>(null);

  const [success, setSuccess] = React.useState(false);

  const compile = React.useCallback(
    (text: string | object, schema: z.ZodTypeAny) => {
      try {
        const json = typeof text === "string" ? JSON.parse(text) : text;

        schema.parse(json);

        message.current?.show({
          severity: "success",
          summary: "Compile Success",
          detail: "JSON is valid.",
        });

        onSuccess?.(json as T);

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
    },
    []
  );

  return { success, message, compile };
};
