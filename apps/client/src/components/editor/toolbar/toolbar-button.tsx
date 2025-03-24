import * as React from "react";

import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface ToolbarButtonProps
  extends React.ComponentPropsWithoutRef<typeof Toggle> {
  isActive?: boolean;
}

export function ToolbarButton({
  isActive,
  children,
  className,
  ...props
}: ToolbarButtonProps) {
  return (
    <Toggle className={cn({ "bg-accent": isActive }, className)} {...props}>
      {children}
    </Toggle>
  );
}
