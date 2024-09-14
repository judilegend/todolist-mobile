import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("TodoApp.db");

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)',
        []
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, text TEXT, completed INTEGER)',
        [],
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

export const getTodos = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM todos",
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

export const addTodo = (text) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO todos (text, completed) VALUES (?, ?)",
        [text, 0],
        (_, { insertId }) => resolve(insertId),
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
