import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("TodoApp.db");

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)",
        [],
        () => {
          tx.executeSql(
            "INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)",
            ["admin", "admin123"],
            () => resolve(),
            (_, error) => reject(error)
          );
        },
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
