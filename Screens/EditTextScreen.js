import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import AntDesignIcon from "react-native-vector-icons/AntDesign";

const EditTextScreen = ({ navigation, route }) => {
    const {textToEdit, editTextCallBack: editTextCallBack, translateFromLanguage,translateToLanguage} = route.params;
    const [newText, setText] = useState(textToEdit);

  return (
    <ScrollView style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen} behavior="position">
        <View style={[styles.container, styles.screen,{marginTop : 20}]}>
          <View style={[styles.screen, { height: 340, margin: 10 }]}>
            <TextInput
              placeholder="Start typing..."
              multiline={true}
              defaultValue={newText}
              style={{ fontSize: 25 , fontWeight : "500"}}
              autoFocus
              onChangeText={(text) => setText(text)}
            ></TextInput>
          </View>
        </View>
        <View
          style={[
            {
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            },
          ]}
        >
          <View
            style={[
              styles.container,
              {
                alignItems: "center",
                paddingVertical: 15,
                paddingHorizontal: 30,
              },
            ]}
          >
            <Text>{translateFromLanguage}</Text>
          </View>
          <View
            style={[
              styles.container,
              {
                alignItems: "center",
                paddingVertical: 15,
                paddingHorizontal: 15,
              },
            ]}
          >
            <AntDesignIcon name="swap" size={20} color="#1DA1F2" />
          </View>
          <View
            style={[
              styles.container,
              {
                alignItems: "center",
                paddingVertical: 15,
                paddingHorizontal: 30,
              },
            ]}
          >
            <Text>{translateToLanguage}</Text>
          </View>
          <TouchableOpacity
          onPress={() => {editTextCallBack(newText)
            navigation.goBack()
          }}
            style={[
              
              {
                backgroundColor: "#fff",
                alignItems: "center",
                paddingVertical: 15,
                paddingHorizontal: 15,
                borderRadius: 30,
                marginRight: 10,
              },
            ]}
          >
            <AntDesignIcon name="arrowright" size={20} color="#1DA1F2" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 10,
   
  },
});

export default EditTextScreen;
