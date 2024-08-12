import { StyleSheet, View, TextInput, Pressable, Text } from "react-native";

/**
 * Represents the registration screen component.
 * @returns {JSX.Element} The registration screen UI.
 */
const NameRegistration = ({navigation}) => {

  const goToEmailRegistration = () => {
    navigation.navigate("EmailRegistration");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell us your name.</Text>
      <View style={{marginTop : 10}}>
        <Text>Enter your name.</Text>
      </View>
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <TextInput
          style={[styles.input, { marginEnd: 20 }]}
          placeholder="First Name"
        />

        <TextInput style={styles.input} placeholder="Last Name" />
      </View>
      <Pressable style={styles.loginButton} onPress={goToEmailRegistration}>
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "grey",
    padding: 17,
    borderRadius: 10,
    marginVertical: 10,
    fontSize: 20,
    flex: 1,
  },
  loginButton: {
    backgroundColor: "#0866FF",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "semi-bold",
  },
  secondaryButtonText: {
    color: "#0866FF",
    fontSize: 20,
  },
});

export default NameRegistration;
