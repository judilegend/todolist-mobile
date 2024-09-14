import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import TodoListScreen from "./screens/TodoListScreen";
import { AuthProvider } from "./context/AuthContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="TodoList" component={TodoListScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
