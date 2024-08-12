import { StyleSheet, View, Pressable,Text } from "react-native";

function BottomButton(props) {
  return (
    <View style={styles.bottomContainer}>
      <View style={styles.bottomButton}>
        <Pressable onPress={props.navigationButtonPressHanlder}>
          <Text>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    borderTopWidth: 1,
    alignItems: "flex-end",
    paddingRight: 30,
    paddingTop: 10,
    borderColor: "#D3D3D3",
  },
  bottomButton: {
    backgroundColor: "#D3D3D3",
    padding: 20,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
});
export default BottomButton;
