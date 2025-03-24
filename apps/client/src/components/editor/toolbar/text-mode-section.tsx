import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToolbarButton } from "./toolbar-button";
import { Editor } from "@tiptap/react";
import { LetterText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextMode {
  label: string;
  element: keyof React.JSX.IntrinsicElements;
  className?: string;
  level?: 1 | 2 | 3;
}

const TextModes: TextMode[] = [
  {
    label: "Normal",
    element: "span",
  },
  {
    label: "Heading 1",
    element: "h1",
    level: 1,
  },
  {
    label: "Heading 2",
    element: "h2",
    level: 2,
  },
  {
    label: "Heading 3",
    element: "h3",
    level: 3,
  },
];

interface TextStyleSectionProps {
  editor: Editor;
}

export function TextModesSection({ editor }: TextStyleSectionProps) {
  const handleTextModeChange = (level: TextMode["level"]) => {
    if (level) {
      editor.chain().focus().toggleHeading({ level }).run();
    } else {
      editor.chain().focus().setParagraph().run();
    }
  };

  const renderItem = (textMode: TextMode) => {
    return (
      <DropdownMenuItem
        key={textMode.label}
        onClick={() => handleTextModeChange(textMode.level)}
        className={cn(
          "cursor-pointer",
          editor.isActive("heading", { level: textMode.level }) &&
            "bg-muted text-muted-foreground",
        )}
      >
        {textMode.label}
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolbarButton isActive={editor.isActive("heading")}>
          <LetterText className="size-8" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent>{TextModes.map(renderItem)}</DropdownMenuContent>
    </DropdownMenu>
  );
}
