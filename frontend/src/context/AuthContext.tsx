import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

const TOKEN_STORAGE_KEY = "takiaway_admin_token";

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// createContext crea el "canal" compartido. El valor por defecto (null-ish)
// solo se usa si algo intenta leer el contexto fuera de AuthProvider.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Al montar, intentamos recuperar un token que haya sobrevivido a un
  // refresh de pagina (sessionStorage persiste mientras la pestaña siga
  // abierta, pero se borra al cerrarla -- ver decision de seguridad en plan.md).
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem(TOKEN_STORAGE_KEY)
  );

  const login = (newToken: string) => {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  };

  const value: AuthContextValue = {
    token,
    isAuthenticated: token !== null,
    login,
    logout,
  };

  // El Provider envuelve la app (en App.tsx) y hace que value este
  // disponible para cualquier componente hijo que llame a useAuth().
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook de conveniencia: en vez de que cada componente escriba
// useContext(AuthContext) y maneje el caso undefined, simplemente hacen
// const { token, login, logout, isAuthenticated } = useAuth();
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
