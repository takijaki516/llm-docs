import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/app/_app")({
  beforeLoad: () => {
    const { accessToken } = useAuthStore.getState();

    if (!accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/app/_app"!
      <Outlet />
    </div>
  );
}
