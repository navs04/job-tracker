import { createContext, useContext, useEffect, useState} from "react";
import type {ReactNode} from "react";
import type {User} from "../api/auth";
import { loginRequest, registerRequest, logoutRequest, refreshRequest } from "../api/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, try to silently refresh — if the httpOnly cookie is still
  // valid, this logs the user back in without them re-entering credentials.
  useEffect(() => {
    refreshRequest()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const user = await loginRequest(email, password);
    setUser(user);
  }

  async function register(name: string, email: string, password: string) {
    const user = await registerRequest(name, email, password);
    setUser(user);
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}