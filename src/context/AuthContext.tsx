import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { setUnauthorizedHandler, TOKEN_KEY } from "../api/client";
import { USE_MOCK } from "../config";
import { authService } from "../services";
import { User } from "../types";

type Ctx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (form: Parameters<typeof authService.register>[0]) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<Ctx>(null as unknown as Ctx);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setUser(null);
    router.replace("/login");
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
    });
    // On app start, check the saved token (real API mode only)
    (async () => {
      try {
        if (!USE_MOCK) {
          const token = await SecureStore.getItemAsync(TOKEN_KEY);
          if (token) setUser(await authService.me());
        }
      } catch {
        // invalid token: stay on the login screen
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveSession = async (token: string, u: User) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    const { token, user } = await authService.login(email, password);
    await saveSession(token, user);
  };

  const register = async (form: Parameters<typeof authService.register>[0]) => {
    const { token, user } = await authService.register(form);
    await saveSession(token, user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}