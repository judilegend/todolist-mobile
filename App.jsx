import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./context/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import TaskListScreen from "./screens/TaskListScreen";
import AddTaskScreen from "./screens/AddTaskScreen";
import { TaskProvider } from "./context/TaskContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TaskList"
            component={TaskListScreen}
            options={{ title: "Tasks" }}
          />
          <Stack.Screen
            name="AddTask"
            component={AddTaskScreen}
            options={{ title: "Add New Task" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </TaskProvider>
    </AuthProvider>
  );
}
