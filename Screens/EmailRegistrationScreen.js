import { StyleSheet, View, TextInput, Pressable, Text } from "react-native";
import { useState } from "react";
/**
 * Represents the registration screen component.
 * @returns {JSX.Element} The registration screen UI.
 */
const EmailRegistration = ({navigation}) => {

  const [email, setEmail] = useState("")

  const textInputHandler = (text) => {
    setEmail(text)
  }

  const goToPasswordRegistration = () => {
    navigation.navigate("PasswordRegistration", {email : email} );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell us your email address.</Text>
      <View style={{ marginTop: 10 }}>
        <Text>Enter the email address at which you can access.</Text>
      </View>

      <TextInput style={[styles.input]} placeholder="Email address" value={email} onChangeText={textInputHandler}/>

      <Pressable style={styles.loginButton} onPress={goToPasswordRegistration}>
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
    marginVertical: 20,
    fontSize: 20,

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
    fontWeight: "semibold",
  },
  secondaryButtonText: {
    color: "#0866FF",
    fontSize: 20,
  },
});

export default EmailRegistration;
