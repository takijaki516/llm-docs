import { create } from "zustand";

interface AuthStore {
  accessToken: string | null;
  isLoggedIn: boolean;
  userEmail: string | null;

  setAccessToken: ({
    accessToken,
    userEmail,
  }: {
    accessToken: string;
    userEmail: string;
  }) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  isLoggedIn: false,
  userEmail: null,
  setAccessToken: ({ accessToken, userEmail }) =>
    set({ accessToken, userEmail, isLoggedIn: true }),
  clearToken: () =>
    set({ accessToken: null, userEmail: null, isLoggedIn: false }),
}));
