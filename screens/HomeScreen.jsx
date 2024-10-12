import React, { useContext, useEffect, useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import { getIssues } from "../services/database";
import { AuthContext } from "../context/AuthContext";

const HomeScreen = ({ navigation }) => {
  const [issues, setIssues] = useState([]);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const loadedIssues = await getIssues();
      setIssues(loadedIssues);
    } catch (error) {
      console.error("Failed to load issues", error);
    }
  };
  return (
    <View style={styles.container}>
      <Button
        title="Report Issue"
        onPress={() => navigation.navigate("ReportIssue")}
      />
      <Button
        title="View Issue Map"
        onPress={() => navigation.navigate("IssueMap")}
      />
      <Button
        title="View Consumption"
        onPress={() => navigation.navigate("Consumption")}
      />
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});

export default HomeScreen;
