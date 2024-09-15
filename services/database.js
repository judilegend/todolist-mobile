import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("ProjectManagement.db");

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, role TEXT)",
        []
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, status TEXT, assigned_to INTEGER, FOREIGN KEY(assigned_to) REFERENCES users(id))",
        []
      );
      tx.executeSql(
        "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
        ["admin", "admin123", "admin"],
        ["user", "user123", "user"],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export const loginUser = (username, password) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows._array[0]);
          } else {
            reject("Invalid credentials");
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT id, username, role FROM users",
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export const addTask = (title, description, assignedTo) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO tasks (title, description, status, assigned_to) VALUES (?, ?, ?, ?)",
        [title, description, "pending", assignedTo],
        (_, { insertId }) => resolve(insertId),
        (_, error) => reject(error)
      );
      getTasks()
    });
  });
};

export const getTasks = (userId = null, isAdmin = false) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      const query = isAdmin
        ? "SELECT tasks.*, users.username as assigned_to_name FROM tasks LEFT JOIN users ON tasks.assigned_to = users.id"
        : "SELECT * FROM tasks WHERE assigned_to = ?";
      const params = isAdmin ? [] : [userId];

      tx.executeSql(
        query,
        params,
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export const updateTaskStatus = (taskId, newStatus) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE tasks SET status = ? WHERE id = ?",
        [newStatus, taskId],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteTask = (taskId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM tasks WHERE id = ?",
        [taskId],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};
