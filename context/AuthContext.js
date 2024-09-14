import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initDatabase, loginUser, registerUser } from "../services/database";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    initDatabase().then(() => {
      checkUserAuthentication();
    });
  }, []);

  const checkUserAuthentication = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'authentification:",
        error
      );
    }
  };

  const login = async (username, password) => {
    try {
      const user = await loginUser(username, password);
      setUser(user);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, password, role = "user") => {
    try {
      const newUser = await registerUser(username, password, role);
      setUser(newUser);
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
