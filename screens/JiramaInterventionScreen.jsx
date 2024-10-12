// import React, { useState, useEffect, useContext } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { AuthContext } from "../context/AuthContext";
// import { getIssues, updateIssueStatus } from "../services/database";
// import { subscribeToIssues } from "../services/realTimeService";
// import { LineChart } from "react-native-chart-kit";

// const JiramaInterventionScreen = () => {
//   const [issues, setIssues] = useState([]);
//   const [statistics, setStatistics] = useState(null);
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     loadIssues();
//     const unsubscribe = subscribeToIssues((newIssue) => {
//       Alert.alert(
//         "New Issue",
//         `A new issue has been reported: ${newIssue.title}`
//       );
//       setIssues((prevIssues) => [...prevIssues, newIssue]);
//     });

//     return () => unsubscribe();
//   }, []);

//   const loadIssues = async () => {
//     try {
//       const loadedIssues = await getIssues();
//       setIssues(loadedIssues);
//       calculateStatistics(loadedIssues);
//     } catch (error) {
//       console.error("Failed to load issues", error);
//     }
//   };

//   const calculateStatistics = (issuesData) => {
//     const totalIssues = issuesData.length;
//     const resolvedIssues = issuesData.filter(
//       (issue) => issue.status === "resolved"
//     ).length;
//     const pendingIssues = totalIssues - resolvedIssues;

//     const waterIssues = issuesData.filter(
//       (issue) => issue.type === "water"
//     ).length;
//     const electricityIssues = issuesData.filter(
//       (issue) => issue.type === "electricity"
//     ).length;

//     setStatistics({
//       totalIssues,
//       resolvedIssues,
//       pendingIssues,
//       waterIssues,
//       electricityIssues,
//     });
//   };

//   const handleIssuePress = async (issue) => {
//     try {
//       await updateIssueStatus(issue.id, "resolved");
//       Alert.alert("Success", "Issue marked as resolved");
//       loadIssues();
//     } catch (error) {
//       console.error("Failed to update issue status", error);
//       Alert.alert("Error", "Failed to update issue status");
//     }
//   };

//   const renderIssueItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.issueItem}
//       onPress={() => handleIssuePress(item)}
//     >
//       <Text style={styles.issueTitle}>{item.title}</Text>
//       <Text>Type: {item.type}</Text>
//       <Text>Status: {item.status}</Text>
//     </TouchableOpacity>
//   );

//   const renderStatistics = () => (
//     <View style={styles.statisticsContainer}>
//       <Text style={styles.statisticsTitle}>Statistics</Text>
//       <LineChart
//         data={{
//           labels: ["Total", "Resolved", "Pending", "Water", "Electricity"],
//           datasets: [
//             {
//               data: [
//                 statistics.totalIssues,
//                 statistics.resolvedIssues,
//                 statistics.pendingIssues,
//                 statistics.waterIssues,
//                 statistics.electricityIssues,
//               ],
//             },
//           ],
//         }}
//         width={300}
//         height={200}
//         chartConfig={{
//           backgroundColor: "#e26a00",
//           backgroundGradientFrom: "#fb8c00",
//           backgroundGradientTo: "#ffa726",
//           decimalPlaces: 0,
//           color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//           style: {
//             borderRadius: 16,
//           },
//         }}
//         bezier
//         style={styles.chart}
//       />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>JIRAMA Intervention Dashboard</Text>
//       {statistics && renderStatistics()}
//       <FlatList
//         data={issues}
//         renderItem={renderIssueItem}
//         keyExtractor={(item) => item.id.toString()}
//         style={styles.list}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   list: {
//     flex: 1,
//   },
//   issueItem: {
//     backgroundColor: "#f0f0f0",
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
//   issueTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   statisticsContainer: {
//     marginBottom: 20,
//   },
//   statisticsTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
// });

// export default JiramaInterventionScreen;
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { getIssues, updateIssueStatus } from "../services/database";

const JiramaInterventionScreen = () => {
  const [issues, setIssues] = useState([]);
  const [statistics, setStatistics] = useState(null);

  const loadIssues = useCallback(async () => {
    try {
      const loadedIssues = await getIssues();
      setIssues(loadedIssues);
      calculateStatistics(loadedIssues);
    } catch (error) {
      console.error("Failed to load issues", error);
      Alert.alert("Error", "Failed to load issues");
    }
  }, []);

  useEffect(() => {
    loadIssues();
    // Here you would set up real-time updates
    // For example: const unsubscribe = subscribeToIssues(handleNewIssue);
    // return () => unsubscribe();
  }, [loadIssues]);

  const calculateStatistics = (issuesData) => {
    const totalIssues = issuesData.length;
    const resolvedIssues = issuesData.filter(
      (issue) => issue.status === "resolved"
    ).length;
    const pendingIssues = totalIssues - resolvedIssues;
    const waterIssues = issuesData.filter(
      (issue) => issue.type === "water"
    ).length;
    const electricityIssues = issuesData.filter(
      (issue) => issue.type === "electricity"
    ).length;

    setStatistics({
      totalIssues,
      resolvedIssues,
      pendingIssues,
      waterIssues,
      electricityIssues,
    });
  };

  const handleIssuePress = async (issue) => {
    try {
      await updateIssueStatus(issue.id, "resolved");
      Alert.alert("Success", "Issue marked as resolved");
      loadIssues();
    } catch (error) {
      console.error("Failed to update issue status", error);
      Alert.alert("Error", "Failed to update issue status");
    }
  };

  const renderIssueItem = ({ item }) => (
    <TouchableOpacity
      style={styles.issueItem}
      onPress={() => handleIssuePress(item)}
    >
      <Text style={styles.issueTitle}>{item.title}</Text>
      <Text>Type: {item.type}</Text>
      <Text>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  const renderStatistics = () => (
    <View style={styles.statisticsContainer}>
      <Text style={styles.statisticsTitle}>Statistics</Text>
      <LineChart
        data={{
          labels: ["Total", "Resolved", "Pending", "Water", "Electricity"],
          datasets: [
            {
              data: [
                statistics.totalIssues,
                statistics.resolvedIssues,
                statistics.pendingIssues,
                statistics.waterIssues,
                statistics.electricityIssues,
              ],
            },
          ],
        }}
        width={300}
        height={200}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>JIRAMA Intervention Dashboard</Text>
      {statistics && renderStatistics()}
      <FlatList
        data={issues}
        renderItem={renderIssueItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
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
  list: {
    flex: 1,
  },
  issueItem: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statisticsContainer: {
    marginBottom: 20,
  },
  statisticsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default JiramaInterventionScreen;
