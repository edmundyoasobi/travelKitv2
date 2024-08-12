import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useContext } from "react";
import { AuthContext } from "../store/auth-context";
import Icon from "react-native-vector-icons/Feather";
import IPADDRESS from "../IpAddress";
import axios from "axios";
import SkeletonLoader from "./SkeletonLoader";
import EntypoIcon from "react-native-vector-icons/Entypo";

const FoodPreferencesModal = ({ route, navigation }) => {
  const authCtx = useContext(AuthContext);
  const { food, convertFrom, convertTo, setMenu ,translateFromLanguage,translateToLanguage} = route.params;
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(
    food.foodPreferences ? food.foodPreferences : []
  );
  const [currentFood, setCurrentFood] = useState(food);

  useEffect(() => {
    //navigation.setOptions({ headerShown: false });
    console.log(preferences);
    if (food.foodPreferences == null || food.foodPreferences.length == 0) {
      const postData = {
        userId : authCtx.userUUID,
        foodName: food.translatedName,
        translateFromLanguage : translateFromLanguage.name,
        translateToLanguage : translateToLanguage.name

      };
      //https://travelkitbackend.onrender.com/foodPreference
      //http://localhost:4999/
        const address = "https://travelkitbackend.onrender.com/foodPreference";
        axios
          .post(address, postData)
          .then((response) => {
            const preferencesWithId = response.data.map((item, index) => ({
              id: index + 1,
              ...item,
            }));
            setPreferences(preferencesWithId);
            setLoading(false);
          })
          .catch((error) => {
            console.error(error.message);
          })
          .catch((error) => {
            alert(
              "Network error . Please try again"
            );
            setIsInferingLanguageAndCurrency(false);
          });
     
    } else {
      setLoading(false);
    }
  }, []);

  const addOrder = () => {
    const selectedPreferences = preferences.filter((pref) => pref.selected);
    setMenu((prevData) =>
      prevData.map((item) =>
        item.id === food.id
          ? {
              ...item,
              foodPreferences: selectedPreferences,
              quantity: currentFood.quantity,
            }
          : item
      )
    );
    navigation.goBack();
  };

  const updateQuantity = (delta) => {
    if (currentFood.quantity + delta < 0) return;
    console.log(delta);
    setCurrentFood((prevData) => ({
      ...prevData,
      quantity: prevData.quantity + delta,
    }));
  };

  const [customPreference, setCustomPreference] = useState("");

  const togglePreference = (id) => {
    console.log(id);

    setPreferences(
      preferences.map((pref) =>
        pref.id === id ? { ...pref, selected: !pref.selected } : pref
      )
    );
  };

  const addCustomPreference = () => {
    if (customPreference.trim() === "") return;
    const newPreference = {
      id: preferences.length + 1,
      preferenceInLanguageOfDiner: customPreference,
      selected: true,
    };

    setPreferences([...preferences, newPreference]);

    setCustomPreference("");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {food.originalName}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 2 }}>
            {food.translatedName}
          </Text>
          <Text style={{ marginTop: 10 }}>{food.description}</Text>
        </View>
        <View>
          <Text>
            {convertFrom} {food.originalPrice}
          </Text>
          <Text>
            {convertTo} {food.priceAfterConversion}
          </Text>
        </View>
      </View>
      <View>
        <Text style={styles.titleStyle}>Special Instructions</Text>
        <Text style={styles.subTitleStyle}>
          Choose and add your food preferences
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.preferenceContainer}>
              {preferences.map((pref) => (
                <TouchableOpacity
                  key={pref.id}
                  style={[
                    styles.preference,
                    pref.selected && styles.selectedPreference,
                  ]}
                  onPress={() => togglePreference(pref.id)}
                >
                  <Text
                    style={[
                      styles.preferenceText,
                      pref.selected && styles.selectedText,
                    ]}
                  >
                    {pref.preference.preferenceInLanguageOfDiner}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
      <View style={styles.input}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <TextInput
            placeholder="Add your own preference"
            value={customPreference}
            onChangeText={setCustomPreference}
          />
        </View>
        <View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={addCustomPreference}
          >
            <Icon name="arrow-up" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          marginTop: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 35,
        }}
      >
        <View style={{ justifyContent: "center" }}>
          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                height: 40,
                width: 100,
              },
            ]}
          >
            <TouchableOpacity
            disabled={currentFood.quantity == 0}
              onPress={() => updateQuantity(-1)}
              style={[
                styles.smallButtonStyle,
                { backgroundColor: currentFood.quantity == 0 ? "grey" : "#1DA1F2" },
              ]}
            >
              <EntypoIcon name="minus" size={20} color={"white"} />
            </TouchableOpacity>
            <View style={{ width: 20, alignItems: "center" }}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                {currentFood.quantity}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => updateQuantity(1)}
              style={[styles.smallButtonStyle, styles.mainBackgroundColor]}
            >
              <EntypoIcon name="plus" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ justifyContent: "center", flex: 1, marginLeft: 20 }}>
          <TouchableOpacity
          disabled={currentFood.quantity == 0}
            onPress={addOrder}
            style={[
            ,
              {
                backgroundColor: currentFood.quantity == 0 ? "grey" : "#1DA1F2" ,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
                paddingVertical: 20,
              },
            ]}
          >
            <Text
              style={[
                styles.addButtonText,
                { fontWeight: "bold", fontSize: 17 },
              ]}
            >
              Add Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainBackgroundColor: {
    backgroundColor: "#1DA1F2",
  },

  smallButtonStyle: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  preferenceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  preference: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    borderColor: "#007BFF",
    borderWidth: 1,
  },
  selectedPreference: {
    backgroundColor: "#007BFF",
  },
  preferenceText: {
    color: "#000",
  },
  selectedText: {
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#9e9d9d",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: "row",
  },
  addButton: {
    backgroundColor: "#007BFF",
    borderRadius: 30,
    alignItems: "center",
    padding: 5,
  },
  nextButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 30,
    marginTop: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
  },
  titleStyle: {
    fontSize: 27,
    fontWeight: "bold",
  },
  subTitleStyle: {
    color: "#9e9d9d",
    fontSize: 15,
    marginVertical: 15,
  },
});

export default FoodPreferencesModal;
