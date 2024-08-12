import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import AntDesignIcon from "react-native-vector-icons/AntDesign";

const ShowTextScreen = ({ navigation, route }) => {
  const [fontSize, setFontSize] = useState(60);
 const { textToShow } = route.params;


  const addFontSizeHandler = () => {
    setFontSize(fontSize + 5);
  };

  const minusFontSizeHandler = () => {
    setFontSize(fontSize - 5);
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <ScrollView style={{ flex: 1 }}>
          <Text style={{ fontSize: fontSize }}>{textToShow}</Text>
        </ScrollView>
      </View>
      <View style={styles.textSizerContainer}>
        <Pressable onPress={addFontSizeHandler}>
          <AntDesignIcon name="plus" size={30}  color="#1877F2"/>
        </Pressable>
        <Pressable onPress={minusFontSizeHandler} disabled={fontSize <= 30}>
          <AntDesignIcon name="minus" size={30}  color="#1877F2"/>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  textSizerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    marginHorizontal: 40,
  },
});

export default ShowTextScreen;
