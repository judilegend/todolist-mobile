import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../services/database";

const TodoListScreen = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    const loadedTodos = await getTodos();
    setTodos(loadedTodos);
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      await addTodo(newTodo);
      setNewTodo("");
      loadTodos();
    }
  };

  const handleToggleTodo = async (id, completed) => {
    await updateTodo(id, !completed);
    loadTodos();
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
    loadTodos();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Add a new todo"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity
              onPress={() => handleToggleTodo(item.id, item.completed)}
            >
              <Text
                style={item.completed ? styles.completedTodo : styles.todoText}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTodo(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
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
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  todoText: {
    fontSize: 16,
  },
  completedTodo: {
    fontSize: 16,
    textDecorationLine: "line-through",
    color: "gray",
  },
  deleteButton: {
    color: "red",
  },
});

export default TodoListScreen;
