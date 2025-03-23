import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Navbar } from "@/components/navbar";
import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/(auth)/_auth")({
  beforeLoad: () => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-dvh flex-col gap-20">
      <Navbar />

      <div className="flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
