import React, { createContext, useContext, useState, ReactNode } from "react";

const TOKEN_STORAGE_KEY = "takiaway_user_token";
const NAME_STORAGE_KEY = "takiaway_user_name";
const EMAIL_STORAGE_KEY = "takiaway_user_email";

interface UserAuthContextValue {
  token: string | null;
  nombre: string | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (token: string, nombre: string, email: string) => void;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextValue | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem(TOKEN_STORAGE_KEY)
  );
  const [nombre, setNombre] = useState<string | null>(() =>
    sessionStorage.getItem(NAME_STORAGE_KEY)
  );
  const [email, setEmail] = useState<string | null>(() =>
    sessionStorage.getItem(EMAIL_STORAGE_KEY)
  );

  const login = (newToken: string, newNombre: string, newEmail: string) => {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    sessionStorage.setItem(NAME_STORAGE_KEY, newNombre);
    sessionStorage.setItem(EMAIL_STORAGE_KEY, newEmail);
    setToken(newToken);
    setNombre(newNombre);
    setEmail(newEmail);
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(NAME_STORAGE_KEY);
    sessionStorage.removeItem(EMAIL_STORAGE_KEY);
    setToken(null);
    setNombre(null);
    setEmail(null);
  };

  const value: UserAuthContextValue = {
    token,
    nombre,
    email,
    isAuthenticated: token !== null,
    login,
    logout,
  };

  return (
    <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
  );
};

export const useUserAuth = (): UserAuthContextValue => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error("useUserAuth debe usarse dentro de un UserAuthProvider");
  }
  return context;
};
