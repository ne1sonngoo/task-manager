import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));

  const value = useMemo(() => {
    const isAuthed = !!token;

    function loginAndSaveToken(newToken) {
      localStorage.setItem("accessToken", newToken);
      setToken(newToken);
    }

    function logout() {
      localStorage.removeItem("accessToken");
      setToken(null);
    }

    return { token, isAuthed, loginAndSaveToken, logout };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
