import { useContext } from "react";
import { EditorContext } from "./EditorContext";

export function useEditor() {
  const editor = useContext(EditorContext);

  return {
    ...editor,
  };
}
