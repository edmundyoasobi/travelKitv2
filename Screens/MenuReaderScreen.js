import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  Button,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import IPADDRESS from "../IpAddress";
import axios from "axios";
import EntypoIcon from "react-native-vector-icons/Entypo";
import LoadingScreen from "./LoadingScreen";

import ImageSkeleton from "./ImageSkeleton";
import { useContext } from "react";
import { AuthContext } from "../store/auth-context";





const MenuReaderScreen = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const authCtx = useContext(AuthContext);
  
  const {
    image,
    translateFromLanguage,
    translateToLanguage,
    convertFrom,
    convertTo,
  } = route.params;
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [menu, setMenu] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [isLoading, setIsLoading] = useState(true);


  const GeminiDetailsModal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modal}>
          <View style={{alignItems : "flex-end", marginVertical : 10}}>
          <TouchableOpacity>
            <AntDesignIcon name="closecircleo" size={24} color="grey" onPress={() => setModalVisible(!modalVisible)} />
          </TouchableOpacity>
          </View>
          <Text>This Food is recommended by Gemini Ai which based on your previous orders</Text>
        </View>
      </Modal>
    );
  };
  // Function to handle quantity change
  const updateQuantity = (id, delta) => {
    setNumberOfOrders(numberOfOrders + delta);
    setMenu((prevData) =>
      prevData.map((item) =>
        item.id == id ? { ...item, quantity: item.quantity + delta } : item
      )
    );
  };

  const navigateToOrderScreen = () => {
    filteredOrders = menu
      .filter((item) => item.quantity > 0)
      .map((item, index) => {
        return {
          id: index,
          foodname: item.originalName,
          translatedFoodName: item.translatedName,
          preferences: item.foodPreferences?.map((item) => item.preference),
          quantity: item.quantity,
          originalPrice: item.originalPrice,
          priceAfterConversion: item.priceAfterConversion,
          extraInfo: "",
        };
      });

    navigation.navigate("OrderScreen", {
      orders: filteredOrders,
      translateFromLanguage: translateFromLanguage,
      translateToLanguage: translateToLanguage,
      convertFrom: convertFrom,
      convertTo: convertTo,
    });
  };

  const openModelHanlder = (food) => {
    navigation.navigate("FoodPreferencesModalScreen", {
      food: food,
      convertFrom: convertFrom,
      convertTo: convertTo,
      setMenu: setMenu,
      translateFromLanguage: translateFromLanguage,
      translateToLanguage: translateToLanguage,
    });
  };

  useEffect(() => {
    const formData = new FormData();
    formData.append("file", {
      uri: image["assets"][0]["uri"],
      name: "IMG_30002.jpg",
      type: image["assets"][0]["mimeType"],
    });
    postData = {
      translateFromLanguage: translateFromLanguage.name,
      translateToLanguage: translateToLanguage.name,
      convertFrom: convertFrom,
      convertTo: convertTo,
      userId: authCtx.userUUID,
    };
    for (const key in postData) {
      if (postData.hasOwnProperty(key)) {
        formData.append(key, postData[key]);
      }
    }
//http://localhost:4999/uploadImage
    //https://travelkitbackend.onrender.com/uploadImage
    const response = axios
      .post("https://travelkitbackend.onrender.com/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setExtraInfo(response.data.otherinfo);
        setMenu(
          response.data.foods.map((item) => {
            return {
              ...item,
              quantity: 0,
            };
          })
        );
        setIsLoading(false);
      })
      .catch((error) => {
        alert("Network error . Please try again");
        setIsInferingLanguageAndCurrency(false);
      });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingScreen image="menuImage" text="Menu Translating..." />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      
      <View style={{ flex: 1, marginBottom: 0 }}>
        <FlatList
          data={menu}
          keyExtractor={(item) => item.id}
          renderItem={(itemData) => (
            <View
            style={{
              marginVertical: 5,
              paddingHorizontal: 10,
              backgroundColor: "white",
            }}>
              {itemData.item.recommended ? (
                
                <View style = {styles.geminiRecommendation} >
                  <Text>Recommended by Gemini</Text>
                  <MaterialCommunityIcons name="star-four-points" size={20} color="#1DA1F2" />
                </View>
              ) : null}
            <TouchableOpacity
              
              onPress={() => openModelHanlder(itemData.item)}
            >
              
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {itemData.item.originalName}
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {itemData.item.translatedName}
                  </Text>
                  <Text>{itemData.item.description}</Text>
                </View>
                <View>
                  <Text>
                    {convertFrom} {itemData.item.originalPrice}
                  </Text>
                  <Text>
                    {convertTo} {itemData.item.priceAfterConversion}
                  </Text>
                </View>
              </View>
              {itemData.item.quantity <= 0 ? (
                <TouchableOpacity
                  style={styles.addButtonStyle}
                  onPress={() => updateQuantity(itemData.item.id, 1)}
                >
                  <Text style={styles.addButtonText}>Add Order</Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: 40,
                      width: 100,
                      marginTop: 10,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.smallButtonStyle}
                    onPress={() => updateQuantity(itemData.item.id, -1)}
                  >
                    <EntypoIcon name="minus" size={20} color="white" />
                  </TouchableOpacity>
                  <View style={{ width: 20, alignItems: "center" }}>
                    <Text>{itemData.item.quantity}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.smallButtonStyle}
                    onPress={() => updateQuantity(itemData.item.id, 1)}
                  >
                    <EntypoIcon name="plus" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.borderlineStyle}></View>
            </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: numberOfOrders == 0 ? "grey" : "#1DA1F2" },
        ]}
        onPress={navigateToOrderScreen}
        disabled={numberOfOrders == 0}
      >
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modal: {
    top: "85%",
    height: "50%",
    backgroundColor: "white",
    paddingHorizontal : 20,
    borderTopWidth: 1,
    borderColor: "#D3D3D3",
  },
  bottomContainer: {
    borderTopWidth: 1,
    alignItems: "flex-end",
    paddingRight: 30,
    paddingTop: 10,
    borderColor: "#D3D3D3",
    marginBottom: 10,
  },
  borderlineStyle: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
    marginTop: 10,
  },
  bottomButton: {
    backgroundColor: "lightgrey",
    padding: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 16,
    width: 150,
    height: 50,

    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  smallButtonStyle: {
    backgroundColor: "#1DA1F2",
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonStyle: {
    backgroundColor: "#1DA1F2",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    marginTop: 10,
    height: 40,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  geminiRecommendation: {
    borderWidth: 1,
    borderColor: "#1DA1F2",
    paddingHorizontal: 5,
    alignSelf: "flex-start",
    alignItems : "center",
    marginBottom: 5,
    borderRadius: 5,
    flexDirection: "row",
    
  },
});

export default MenuReaderScreen;
