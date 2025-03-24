import * as React from "react";
import {
  useEditor,
  type UseEditorOptions,
  type Content,
  Editor,
} from "@tiptap/react";
import { extensions } from "./extentions";

export interface UseMyEditorOptions extends UseEditorOptions {
  value?: Content;
  output?: "html" | "json" | "text";
  className?: string;
  onUpdate?: (content: Content) => void;
  onBlur?: (content: Content) => void;
}

export const useMyEditor = ({
  value,
  output,
  onUpdate,
  onBlur,
  ...props
}: UseMyEditorOptions) => {
  // TODO: fix it
  const handleUpdate = React.useCallback((editor: Editor) => {
    let outputValue: Content;
    switch (output) {
      case "html":
        outputValue = editor.getHTML();
        break;
      case "json":
        outputValue = editor.getJSON();
        break;
      default:
        outputValue = editor.getText();
        break;
    }

    onUpdate?.(outputValue);
  }, []);

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value);
      }
    },
    [value],
  );

  // REVIEW:
  const handleBlur = React.useCallback((editor: Editor) => {
    let outputValue: Content;
    switch (output) {
      case "html":
        outputValue = editor.getHTML();
        break;
      case "json":
        outputValue = editor.getJSON();
        break;
      default:
        outputValue = editor.getText();
        break;
    }

    onBlur?.(outputValue);
  }, []);

  const editor = useEditor({
    extensions,
    onUpdate: () => handleUpdate,
    onCreate: () => handleCreate,
    onBlur: () => handleBlur,
    ...props,
  });

  return editor;
};
