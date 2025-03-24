import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MyEditor } from "@/components/editor";

export const Route = createFileRoute("/app/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [editorContent, setEditorContent] = React.useState("LETS GO");

  return (
    <div className="flex">
      {editorContent}
      <MyEditor
        value={editorContent}
        onChange={(value) => setEditorContent(value?.toString() ?? "")}
        output="html"
      />
    </div>
  );
}
