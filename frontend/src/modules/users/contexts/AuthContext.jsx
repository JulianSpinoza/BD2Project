import { createContext, useContext } from "react";
import { useAxiosAuth } from "../../../services/api/useAxiosAuth";
import httpClient from "../../../services/api/httpClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  
  const contextValue = useAxiosAuth(httpClient);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
