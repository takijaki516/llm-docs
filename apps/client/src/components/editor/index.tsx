import { type Content, EditorContent } from "@tiptap/react";

import { useMyEditor, UseMyEditorOptions } from "./use-editor";
import { EditorToolbar } from "./toolbar";

interface MyEditorProps extends Omit<UseMyEditorOptions, "onUpdate"> {
  value?: Content;
  className?: string;
  onChange?: (value: Content) => void;
}

export const MyEditor = ({
  value,
  onChange,
  className,
  ...props
}: MyEditorProps) => {
  const editor = useMyEditor({
    value,
    onUpdate: onChange,
    ...props,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={className}>
      <div>
        <EditorToolbar editor={editor} />
      </div>

      <EditorContent editor={editor} className="my-editor" />
    </div>
  );
};
