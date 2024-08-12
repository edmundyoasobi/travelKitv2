import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const WeatherContainer = (props) => {
  return (

      <LinearGradient
        colors={["#192f6a", "#3b5998", "#4c669f"]}
        style={styles.container}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View>
          <Text style={styles.title}>{props.city} {props.country}</Text>
          <Text style={styles.bigTitle}>{props.temp}</Text>
          <Text style={styles.text}>{props.season}</Text>
          <Text style={styles.text}>H:{props.hi}</Text>
          <Text style={styles.text}>L:{props.lo}</Text>
        </View>
      </LinearGradient>

  );
};

const styles = StyleSheet.create({
  container: {
    alignItems : "center",
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 20,
  },
  bigTitle: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "semibold",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff", // Added text color for better visibility
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  text: {
    fontSize: 16,
    color: "#fff", // Added text color for better visibility
  },
});

export default WeatherContainer;
