import { Text, View, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";

const imageMap = {
  image1: require('../assets/travel.png'),
  image2: require('../assets/travel-bag.png'),
  menuImage : require('../assets/menu.png'),
  
  // Add more images asince s needed
};

const LoadingScreen = (props) => {
  const imageSource = imageMap[props.image];
  return (
    <View style={styles.loadingContainer}>
      <Animatable.Image
        animation="pulse"
        iterationCount="infinite"
        duration={3000}
        source={imageSource} // Replace with your image URL
        style={styles.loadingImage}
      />
      <Animatable.Text
        animation="jello"
        iterationCount="infinite"
        duration={3000}
        style={styles.loadingText}
      >
        {props.text}
      </Animatable.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingImage: {
    width: 75,
    height: 75,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 15,
  },
});

export default LoadingScreen;
