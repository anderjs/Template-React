import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";

/**
 * @description
 * Load language json.
 */
export const ext = [loadLanguage("json")];

/**
 * @see https://uiwjs.github.io/react-codemirror/
 * Code mirror setup.
 */
export const setup: ReactCodeMirrorProps["basicSetup"] = {
  highlightActiveLineGutter: true,
  highlightActiveLine: true,
  syntaxHighlighting: true,
  lineNumbers: true,
  lintKeymap: true,
};
