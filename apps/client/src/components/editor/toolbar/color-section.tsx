import * as React from "react";
import { PaintBucket } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";

interface ColorItem {
  label: string;
  color: string;
}

const COLORS: ColorItem[] = [
  {
    label: "Black",
    color: "oklch(0.000 0.000 0.000)",
  },
  {
    label: "White",
    color: "oklch(0.999 0.000 0.000)",
  },
  {
    label: "Gray",
    color: "oklch(0.333 0.005 270.000)",
  },
  {
    label: "Red",
    color: "oklch(0.637 0.237 25.331)",
  },
  {
    label: "Green",
    color: "oklch(0.723 0.219 149.579)",
  },
  {
    label: "Blue",
    color: "oklch(0.623 0.214 259.815)",
  },
  {
    label: "Yellow",
    color: "oklch(0.795 0.184 86.047)",
  },
  {
    label: "Purple",
    color: "oklch(0.627 0.265 303.9)",
  },
  {
    label: "Pink",
    color: "oklch(0.656 0.241 354.308)",
  },
];

interface ColorSectionProps {
  editor: Editor;
}

export function ColorSection({ editor }: ColorSectionProps) {
  const color =
    editor.getAttributes("textStyle")?.color || "hsl(var(--foreground))";
  const [selectedColor, setSelectedColor] = React.useState(color);

  const handleColorChange = React.useCallback(
    (color: string) => {
      setSelectedColor(color);
      editor.chain().setColor(color).run();
    },
    [editor],
  );

  const renderItem = (item: ColorItem) => {
    return (
      <DropdownMenuItem
        key={item.label}
        onClick={() => handleColorChange(item.color)}
        className="flex cursor-pointer items-center justify-center"
      >
        <div
          className={cn(
            "size-6 rounded-sm",
            // item.color === selectedColor && "border-2 border-black",
          )}
          style={{ backgroundColor: item.color }}
        />
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PaintBucket
          className={cn("hover:text-muted-foreground size-8 cursor-pointer")}
          style={{ color: selectedColor }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <div className="grid grid-cols-3">{COLORS.map(renderItem)}</div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
