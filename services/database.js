import { openDatabase } from "react-native-sqlite-storage";

const db = openDatabase({ name: "TodoApp.db" });

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, role TEXT)",
        []
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, text TEXT, completed INTEGER)",
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export const addTodo = (userId, text) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO todos (user_id, text, completed) VALUES (?, ?, 0)",
        [userId, text],
        (_, { insertId }) => resolve(insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const getTodos = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM todos WHERE user_id = ?",
        [userId],
        (_, { rows }) => resolve(rows.raw()),
        (_, error) => reject(error)
      );
    });
  });
};

export const updateTodo = (id, completed) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE todos SET completed = ? WHERE id = ?",
        [completed ? 1 : 0, id],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteTodo = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM todos WHERE id = ?",
        [id],
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
            resolve(rows.item(0));
          } else {
            reject("Identifiants invalides");
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const registerUser = (username, password, role = "user") => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, password, role],
        (_, { insertId }) => resolve({ id: insertId, username, role }),
        (_, error) => reject(error)
      );
    });
  });
};
