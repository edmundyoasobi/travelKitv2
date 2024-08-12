import { StyleSheet, View, TextInput, Pressable, Text } from "react-native";
import { createUser } from "../util/auth";
import LoadingScreen from "./LoadingScreen";
import { useContext,useState } from "react";
import { AuthContext } from "../store/auth-context";
import { CommonActions } from '@react-navigation/native';


/**
 * Represents the registration screen component.
 * @returns {JSX.Element} The registration screen UI.
 */
const PasswordRegistration = ({navigation, route}) => {

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  const { email } = route.params;

  const [password, setPassword] = useState("");

  const textChangeHandler = (text) => {
    setPassword(text);
  }

  const goToTravelPreferences = async () => {
    setIsAuthenticating(true);
    try {
    const [token,userId] = await createUser(email, password);
    alert("User created successfully");
    
    authCtx.authenticate(token,userId);
    navigation.navigate("MenuImageUploadScreen");
    setIsAuthenticating(false);
  }
  catch (error) {
    setIsAuthenticating(false);
    alert(error.message);
  }

  }
  if (isAuthenticating) {
    return <LoadingScreen  image="image1" text="Creating User..."/>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Give your account a password.</Text>
      <View style={{ marginTop: 10 }}>
        <Text>Create a password with at least 8 characters. Try make it hard to guess!</Text>
      </View>

      <TextInput style={[styles.input]} placeholder="Password"  onChangeText={textChangeHandler} value={password}/>

      <Pressable style={styles.loginButton} onPress={goToTravelPreferences}>
        <Text style={styles.buttonText}>Create Account</Text>
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
    fontWeight: "semi-bold",
  },
  secondaryButtonText: {
    color: "#0866FF",
    fontSize: 20,
  },
});

export default PasswordRegistration;
