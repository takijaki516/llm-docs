import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="text-red text-5xl">HHH</div>
    </div>
  );
}
