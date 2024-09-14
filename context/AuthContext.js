import React, { createContext, useState, useEffect } from "react";
import { initDatabase, loginUser } from "../services/database";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const login = async (username, password) => {
    try {
      const user = await loginUser(username, password);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
