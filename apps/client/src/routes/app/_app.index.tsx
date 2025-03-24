import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MyEditor } from "@/components/editor";

export const Route = createFileRoute("/app/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [editorContent, setEditorContent] = React.useState("");

  return (
    <MyEditor
      value={editorContent}
      onChange={(value) => setEditorContent(value?.toString() ?? "")}
      output="html"
      className="relative flex h-full flex-col border border-red-500"
    />
  );
}
