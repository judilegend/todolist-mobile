import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AuthContext } from "../context/AuthContext";
import { getConsumptionData } from "../services/database";

const ConsumptionScreen = () => {
  const [waterData, setWaterData] = useState([]);
  const [electricityData, setElectricityData] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadConsumptionData();
  }, []);

  const loadConsumptionData = async () => {
    try {
      const data = await getConsumptionData(user.id);
      setWaterData(data.water);
      setElectricityData(data.electricity);
    } catch (error) {
      console.error("Failed to load consumption data", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Consumption</Text>
      <LineChart
        data={{
          labels: waterData.map((item) => item.date),
          datasets: [{ data: waterData.map((item) => item.value) }],
        }}
        width={300}
        height={200}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      />

      <Text style={styles.title}>Electricity Consumption</Text>
      <LineChart
        data={{
          labels: electricityData.map((item) => item.date),
          datasets: [{ data: electricityData.map((item) => item.value) }],
        }}
        width={300}
        height={200}
        chartConfig={{
          backgroundColor: "#4e79a7",
          backgroundGradientFrom: "#4e79a7",
          backgroundGradientTo: "#7aa6c2",
          decimalPlaces: 2,
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default ConsumptionScreen;
