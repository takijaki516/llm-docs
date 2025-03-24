import { createFileRoute } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const userEmail = useAuthStore((state) => state.userEmail);

  return <div>{userEmail}</div>;
}
