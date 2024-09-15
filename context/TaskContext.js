import React, { createContext, useState, useEffect } from "react";
import {
  getTasks,
  addTask as addTaskService,
  updateTaskStatus as updateTaskStatusService,
  deleteTask as deleteTaskService,
} from "../services/database";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      loadTasks(user.id, user.role === "admin");
    }
  }, [user]);

  const loadTasks = async (userId, isAdmin) => {
    try {
      const loadedTasks = await getTasks(userId, isAdmin);
      setTasks(loadedTasks);
    } catch (error) {
      console.error("Failed to load tasks", error);
    }
  };

  const addTask = async (title, description, assignedTo) => {
    try {
      const newTask = await addTaskService(title, description, assignedTo);

      setTasks((prevTasks) => [...prevTasks, newTask]); // Ajouter immédiatement la nouvelle tâche
      console.log("yjffjfjfjhhjhj", tasks);
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await updateTaskStatusService(taskId, newStatus);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      ); // Mise à jour de la tâche avec le nouveau statut
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteTaskService(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId)); // Suppression immédiate de la tâche
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        loadTasks,
        updateTaskStatus,
        deleteTask,
        setUser,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
