import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getTasks, updateTaskStatus, deleteTask } from "../services/database";

const TaskListScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const loadedTasks = await getTasks(user.id, user.role === "admin");
      setTasks(loadedTasks);
    } catch (error) {
      Alert.alert("Error", "Failed to load tasks");
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      loadTasks();
    } catch (error) {
      Alert.alert("Error", "Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (user.role !== "admin") {
      Alert.alert("Error", "Only admins can delete tasks");
      return;
    }

    try {
      await deleteTask(taskId);
      loadTasks();
    } catch (error) {
      Alert.alert("Error", "Failed to delete task");
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Status: {item.status}</Text>
      {user.role === "admin" && (
        <Text>Assigned to: {item.assigned_to_name}</Text>
      )}
      <View style={styles.actionButtons}>
        {user.role === "admin" || item.assigned_to === user.id ? (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() =>
              handleUpdateStatus(
                item.id,
                item.status === "pending" ? "completed" : "pending"
              )
            }
          >
            <Text style={styles.buttonText}>
              {item.status === "pending" ? "Mark Completed" : "Mark Pending"}
            </Text>
          </TouchableOpacity>
        ) : null}
        {user.role === "admin" && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteTask(item.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task List</Text>
      {user.role === "admin" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddTask")}
        >
          <Text style={styles.buttonText}>Add New Task</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  taskItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#4CD964",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
});

export default TaskListScreen;
