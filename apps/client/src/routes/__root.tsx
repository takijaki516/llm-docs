import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { ThemeProvider } from "@/components/theme-provider";
import { useAuthStore } from "@/store/auth-store";

export const Route = createRootRoute({
  beforeLoad: async () => {
    const { accessToken, setAccessToken } = useAuthStore.getState();

    if (!accessToken) {
      const res = await fetch("http://localhost:3000/auth/refresh-token", {
        credentials: "include",
        method: "POST",
      });

      if (res.ok) {
        const { accessToken, user } = await res.json();
        setAccessToken({ accessToken, userEmail: user.email });
      }
    }
  },
  component: () => {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Outlet />
        <TanStackRouterDevtools />
      </ThemeProvider>
    );
  },
});
