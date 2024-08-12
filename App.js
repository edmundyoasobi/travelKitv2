import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./Screens/LoginScreen";
import NameRegistration from "./Screens/NameRegistrationScreen";
import EmailRegistration from "./Screens/EmailRegistrationScreen";
import PasswordRegistration from "./Screens/PasswordRegistrationScreen";
import AuthContextProvider from "./store/auth-context";
import { useContext } from "react";
import MenuImageUploadScreen from "./Screens/MenuImageUploadScreen";
import MenuReaderScreen from "./Screens/MenuReaderScreen";
import OrderScreen from "./Screens/OrderScreen";
import LanguagesSelectionModalScreen from "./Screens/LanguagesSelectionModalScreen";
import CurrencySelectionModalScreen from "./Screens/CurrencySelectionModalScreen";
import FoodPreferencesModal from "./Screens/FoodPreferenceScreen";
import FixOrderModalScreen from "./Screens/FixOrderScreen";
import EditTextScreen from "./Screens/EditTextScreen";
import ShowTextScreen from "./Screens/ShowTextScreen";
import { AuthContext } from "./store/auth-context";


const Stack = createStackNavigator();
//q: What is the purpose of this file?
//a: This file is the entry point of the app. It is the first file that is executed when the app is run. It is the main file that contains the main code of the app.

function AuthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Group>
      
      <Stack.Screen
          name="MenuImageUploadScreen"
          component={MenuImageUploadScreen}
          options={{headerLeft: null}}
        />
      
        
        

        <Stack.Screen name="MenuReaderScreen" component={MenuReaderScreen} />
        <Stack.Screen name="OrderScreen" component={OrderScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
      <Stack.Screen
          name="ShowTextScreen"
          component={ShowTextScreen}
          options={ {title :"", headerBackTitle: 'Back'}}
        />
        <Stack.Screen
          name="LanguagesSelectionModalScreen"
          component={LanguagesSelectionModalScreen}
          options={{ headerLeft: () => null }}
        />
        <Stack.Screen
          name="CurrencySelectionModalScreen"
          component={CurrencySelectionModalScreen}
          options={{ headerLeft: () => null }}
        />
        <Stack.Screen
          name="FoodPreferencesModalScreen"
          component={FoodPreferencesModal}
          options={{ headerLeft: () => null, headerShown: false }}
        />
        <Stack.Screen
          name="FixOrderScreenModalScreen"
          component={FixOrderModalScreen}
          options={{ headerLeft: () => null, headerShown: false }}
        />
        
        <Stack.Screen name="EditTextScreen" component={EditTextScreen} options={ {title :"", headerBackTitle: 'Back'}}/>
      </Stack.Group>
    </Stack.Navigator>
  );
}

function UnauthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="NameRegistration" component={NameRegistration} />
      <Stack.Screen name="EmailRegistration" component={EmailRegistration} />
      <Stack.Screen
        name="PasswordRegistration"
        component={PasswordRegistration}
      />


    </Stack.Navigator>
  );
}

function Root() {
  const authCtx = useContext(AuthContext);

  return(
  <NavigationContainer>

    {authCtx.isAuthenticated ? (
      <AuthenticatedStack />
    ) : (
      <UnauthenticatedStack />
    )}
  </NavigationContainer>
  )
}

export default function App() {
  //q:how to comment in JSX
  return (
    
    <View style={styles.container}>
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
      <StatusBar style="auto" />
    </View>
  )
   /*
    <View style={styles.container}>
      <NavigationContainer>
        <UnauthenticatedStack />
       
      </NavigationContainer>
    </View>
  );
  */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
