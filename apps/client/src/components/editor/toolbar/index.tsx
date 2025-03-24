import { Separator } from "@/components/ui/separator";
import { Editor } from "@tiptap/react";

import { TextModesSection } from "./text-mode-section";
import { ColorSection } from "./color-section";

export function EditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex items-center gap-2 border-b border-green-500">
      <TextModesSection editor={editor} />
      <Separator orientation="vertical" className="mx-2 h-7 w-2 bg-green-500" />
      <ColorSection editor={editor} />
    </div>
  );
}
