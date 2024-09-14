import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../services/database";

const TodoListScreen = ({ navigation }) => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos(user.id);
      setTodos(
        loadedTodos.map((todo) => ({
          ...todo,
          completed: todo.completed === 1,
        }))
      );
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error);
    }
  };

  const handleAddTodo = async () => {
    if (inputText.trim() !== "") {
      try {
        const newTodoId = await addTodo(user.id, inputText);
        setTodos([
          ...todos,
          { id: newTodoId, text: inputText, completed: false },
        ]);
        setInputText("");
      } catch (error) {
        console.error("Erreur lors de l'ajout de la tâche:", error);
        Alert.alert("Erreur", "Impossible d'ajouter la tâche");
      }
    } else {
      Alert.alert("Erreur", "Veuillez entrer une tâche valide.");
    }
  };

  const handleToggleTodo = async (id, completed) => {
    try {
      await updateTodo(id, !completed);
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
      Alert.alert("Erreur", "Impossible de mettre à jour la tâche");
    }
  };

  const handleDeleteTodo = (id) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer cette tâche ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              await deleteTodo(id);
              setTodos(todos.filter((todo) => todo.id !== id));
            } catch (error) {
              console.error(
                "Erreur lors de la suppression de la tâche:",
                error
              );
              Alert.alert("Erreur", "Impossible de supprimer la tâche");
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Login");
  };

  const renderTodoItem = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        onPress={() => handleToggleTodo(item.id, item.completed)}
        style={styles.todoTextContainer}
      >
        <Text
          style={[styles.todoText, item.completed && styles.completedTodoText]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleDeleteTodo(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ma Liste de Tâches</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ajouter une nouvelle tâche"
        />
        <TouchableOpacity onPress={handleAddTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (styles restent les mêmes)
});

export default TodoListScreen;
