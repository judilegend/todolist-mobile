import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TaskContext } from "../context/TaskContext";

const ReportIssueScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("water");
  const { addTask } = useContext(TaskContext);

  const handleSubmit = async () => {
    try {
      await addTask(title, description, issueType);
      Alert.alert("Success", "Issue reported successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to report issue");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Issue Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Picker
        selectedValue={issueType}
        onValueChange={(itemValue) => setIssueType(itemValue)}
      >
        <Picker.Item label="Water" value="water" />
        <Picker.Item label="Electricity" value="electricity" />
      </Picker>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ReportIssueScreen;
