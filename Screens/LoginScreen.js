import { StyleSheet, View, TextInput, Pressable, Text , Image} from "react-native";
import { useState , useEffect} from "react";
import { loginUser } from "../util/auth";
import LoadingScreen from "./LoadingScreen";
import { useContext } from "react";
import { AuthContext } from "../store/auth-context";


const LoginScreen = ({navigation}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authCtx = useContext(AuthContext);

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  

  const emailChangeHandler = (text) => {
    setEmail(text);
  }

  const passwordChangeHandler = (text) => {
    setPassword(text);
  }

  const createNewAccount = () => {
    navigation.navigate("NameRegistration");
  }

  const login = async () => {
    console.log(authCtx.token)
    
    setIsAuthenticating(true);
    try {
      const [token,userId] = await loginUser(email, password);
      authCtx.authenticate(token,userId);
      setIsAuthenticating(false);
      
    }
    catch (error) {
      setIsAuthenticating(false);
      alert(error.message);
    }
  }

  if (isAuthenticating) {
    return <LoadingScreen  image="image1" text="Logining in User..."/>;
  }
  return (
    <View style={styles.container}>
      
      <View style={{ flex: 1, justifyContent: "center" }}>
      <View style={{alignItems: "center", marginTop: 50, justifyContent : "center", marginBottom : 70}}>
      <Image source={require('../assets/menu.png')} style={{width: 100, height: 100}}/>
      </View>
        <Text style={styles.title}>Email</Text>
        <TextInput style={styles.input} placeholder="Email" onChangeText={emailChangeHandler} value={email}/>
        <Text style={styles.title}>Password</Text>
        <TextInput style={styles.input} placeholder="Password" textContentType="password" secureTextEntry={true} onChangeText={passwordChangeHandler} value={password}/>
        <Pressable style={styles.loginButton} onPress={login}>
          <Text style={styles.buttonText}>Log in</Text>
        </Pressable>
      </View>
      <View style={{marginBottom: 70}}>
        <Pressable style={styles.newAccountButton} onPress={createNewAccount} >
          <Text style={styles.secondaryButtonText}>Create new account</Text>
        </Pressable>
      </View>
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
  newAccountButton: {
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    borderColor: "#0866FF",
    borderWidth: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "condensedBold",
  },
  secondaryButtonText: {
    color: "#0866FF",
    fontSize: 20,
  },
});

export default LoginScreen;
