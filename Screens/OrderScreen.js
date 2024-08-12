// App.js
import React, { useEffect, useState } from "react";
import {
  Button,
  View,
  StyleSheet,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Audio } from "expo-av";
import { useContext } from "react";
import { AuthContext } from "../store/auth-context";
import axios from "axios";
import EntypoIcon from "react-native-vector-icons/Entypo";
import IPADDRESS from "../IpAddress";
import IconFeather from "react-native-vector-icons/Feather";
import SkeletonTemplate from "../Components/SkeletonTemplate";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import AntDesignIcon from "react-native-vector-icons/AntDesign";

//
export default function OrderScreen({ navigation, route }) {
  const authCtx = useContext(AuthContext);
  const [waiterBuffer, setWaiterSound] = useState(null);
  const [dinerBuffer, setDinerSound] = useState(null);
  const [languageOfDiner, setLanguageOfDiner] = useState("");
  const [languageOfWaiter, setLanguageOfWaiter] = useState("");
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState();
  const {
    orders,
    translateFromLanguage,
    translateToLanguage,
    convertFrom,
    convertTo,
  } = route.params;
  const [ordersState, setOrders] = useState(orders);

  const totalPrice = orders.reduce(
    (acc, item) => {
      acc.totalOriginalPrice += item.originalPrice * item.quantity;
      acc.totalPriceAfterConversion +=
        item.priceAfterConversion * item.quantity;
      acc.totalOriginalPrice = parseFloat(acc.totalOriginalPrice.toFixed(2));
      acc.totalPriceAfterConversion = parseFloat(
        acc.totalPriceAfterConversion.toFixed(2)
      );
      return acc;
    },
    { totalOriginalPrice: 0, totalPriceAfterConversion: 0 }
  );

  const [modificationNeeded, setModificationNeeded] = useState(false);

  const translateOrder = async () => {
    const postData = {
      order: ordersState.filter((item) => item.quantity > 0),
      translateFromLanguage: translateFromLanguage.name,
      translateToLanguage: translateToLanguage.name,
      userId: authCtx.userUUID,
    };
    //http://localhost:4999/textToSpeech
    //https://travelkitbackend.onrender.com/textToSpeech
    const response = axios
      .post("https://travelkitbackend.onrender.com/textToSpeech", postData)
      .then((response) => {
        const arrayBuffer = response.data.audio;
        setLanguageOfDiner(response.data.languageOfDiner);
        setLanguageOfWaiter(response.data.languageOfWaiter);
        setWaiterSound(response.data.audioOfWaiter);
        setDinerSound(response.data.audioOfDiner);
        setLoading(false);
      })
      .catch((error) => {
        alert("Network error . Please try again");
        setIsInferingLanguageAndCurrency(false);
      });
  };

  useEffect(() => {
    console.log(orders);
    translateOrder();
  }, []);

  const goToEditText = () => {
    navigation.navigate("EditTextScreen", {
      textToEdit: languageOfDiner,
      editTextCallBack: editDinerTextCallBack,
      translateFromLanguage: translateToLanguage.name,
      translateToLanguage: translateFromLanguage.name,
    });
  };

  const goToWaiterEditText = () => {
    navigation.navigate("EditTextScreen", {
      textToEdit: languageOfWaiter,
      editTextCallBack: editWaiterTextCallBack,
      translateFromLanguage: translateFromLanguage.name,
      translateToLanguage: translateToLanguage.name,
    });
  };

  const goToShowFullText = (text) => {
    navigation.navigate("ShowTextScreen", {
      textToShow: text,
    });
  };

  const fixOrderPressHandler = () => {
    const ordersToSolved = ordersState.filter(
      (item) => item.problemSolved === false
    );
    navigation.navigate("FixOrderScreenModalScreen", {
      orders: ordersToSolved,
      fixOrderCallBack: fixOrderCallBack,
    });
  };

  const editDinerTextCallBack = (text) => {
    setLanguageOfDiner(text);
    setLoading(true);
    const postData = {
      text: text,
      translateFromLanguage: translateToLanguage.name,
      translateToLanguage: translateFromLanguage.name,
    };
    console.log("postData", postData);

    const response = axios
      .post("https://travelkitbackend.onrender.com/editText", postData)
      .then((response) => {
        console.log(response.data);
        setLanguageOfWaiter(response.data.translateToText);
        setWaiterSound(response.data.audioOfTranslatedText);
        setDinerSound(response.data.audioOfOriginalText);
        setLoading(false);
      })
      .catch((error) => {
        alert("Network error . Please try again");
        setIsInferingLanguageAndCurrency(false);
      });
  };

  const editWaiterTextCallBack = (text) => {
    setLanguageOfWaiter(text);
    setLoading(true);
    const postData = {
      text: text,
      translateFromLanguage: translateFromLanguage.name,
      translateToLanguage: translateToLanguage.name,
    };
    console.log("postData", postData);

    const response = axios
      .post("https://travelkitbackend.onrender.com/editText", postData)
      .then((response) => {
        console.log(response.data);
        setLanguageOfDiner(response.data.translateToText);
        setDinerSound(response.data.audioOfTranslatedText);
        setWaiterSound(response.data.audioOfOriginalText);
        setLoading(false);
      })
      .catch((error) => {
        alert("Network error . Please try again");
        setIsInferingLanguageAndCurrency(false);
      });
  };

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        if (recording) {
          await recording.stopAndUnloadAsync();
          setRecording(null); // Clear the current recording
        }
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopWaiterRecording() {
    setRecording(undefined);
    setLoading(true);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    await uploadWaiterAudio(uri);
  }

  async function stopDinerRecording() {
    setRecording(undefined);
    setLoading(true);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    await uploadDinerAudio(uri);
  }

  const fixOrderCallBack = (updatedOrders) => {
    setLoading(true);
    const updatedOrders2 = ordersState.map((order) => {
      const match = updatedOrders.find((item) => item.id == order.id);
      if (match) {
        return {
          ...match,
          extraInfo: "",
          options: match.options.filter((option) => option.selected),
          problemSolved: true,
        };
      }
      return order;
    });
    const postData = {
      order: updatedOrders,
      translateFromLanguage: translateFromLanguage.name,
      translateToLanguage: translateToLanguage.name,
    };

    const response = axios
      .post("https://travelkitbackend.onrender.com/fixorder", postData)
      .then((response) => {
        console.log(response.data);
        setLanguageOfDiner(response.data.languageOfDiner);
        setLanguageOfWaiter(response.data.languageOfWaiter);
        setWaiterSound(response.data.audioOfWaiter);
        setDinerSound(response.data.audioOfDiner);
        setLoading(false);
        setModificationNeeded(false);
      })
      .catch((error) => {
        alert("Network error . Please try again");
        setIsInferingLanguageAndCurrency(false);
      });

    setOrders(updatedOrders2);
  };

  const uploadWaiterAudio = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "recording.mp3",
      type: "audio/mp3",
    });
    console.log("languageCode", translateFromLanguage.languageCode);
    formData.append("order", JSON.stringify(orders));
    formData.append("translateFromLanguage", translateFromLanguage.name);
    formData.append(
      "translateFromLanguageCode",
      translateFromLanguage.languageCode
    );
    formData.append("translateToLanguage", translateToLanguage.name);

    axios
      .post("https://travelkitbackend.onrender.com/uploadAudio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setLanguageOfDiner(response.data.translatedTranscription);
        setLanguageOfWaiter(response.data.originalTranscription);
        setWaiterSound(response.data.audioOfWaiter);
        setDinerSound(response.data.audioOfDiner);
        setLoading(false);
        if (response.data.modifyOrderorExtraInfoNeeded === true) {
          const updatedOrders = ordersState.map((order) => {
            const match = response.data.modificationsOrExtraInfo?.find(
              (item) => item.foodid == order.id
            );
            if (match) {
              return {
                ...order,
                extraInfo: match.reason,
                options: match.modificationOptionsForDiner,
                problemSolved: false,
              };
            }
            return order;
          });

          setOrders(updatedOrders);
          setModificationNeeded(true);
        }
      })
      .catch((error) => {
        alert("Network error . Please try again");
        setIsInferingLanguageAndCurrency(false);
      });
  };

  const uploadDinerAudio = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "recording.mp3",
      type: "audio/mp3",
    });

    formData.append("order", JSON.stringify(orders));
    formData.append("translateFromLanguage", translateFromLanguage.name);
    formData.append(
      "translateFromLanguageCode",
      translateFromLanguage.languageCode
    );
    formData.append("translateToLanguage", translateToLanguage.name);

    axios
      .post(
        "https://travelkitbackend.onrender.com/uploadDinerAudio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setLanguageOfWaiter(response.data.translatedTranscription);
        setLanguageOfDiner(response.data.originalTranscription);
        setWaiterSound(response.data.audioOfWaiter);
        setDinerSound(response.data.audioOfDiner);
        setLoading(false);
      })
      .catch((error) => {
        alert("Network error . Please try again");
        setIsInferingLanguageAndCurrency(false);
      });
  };

  // Function to handle quantity change
  const updateQuantity = (id, delta) => {
    setOrders((prevData) =>
      prevData.map((item) =>
        item.id == id ? { ...item, quantity: item.quantity + delta } : item
      )
    );
  };

  const playWaiterSound = async () => {
    console.log("Playing Sound");
    const { sound } = await Audio.Sound.createAsync({
      uri: `data:audio/wav;base64,${waiterBuffer}`,
    });
    await sound.playAsync().then(() => {
      console.log("Sound Played");
    });
  };
  const playDinerSound = async () => {
    console.log("Playing Sound");
    const { sound } = await Audio.Sound.createAsync({
      uri: `data:audio/wav;base64,${dinerBuffer}`,
    });
    await sound.playAsync().then(() => {
      console.log("Sound Played");
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1.2, marginBottom: 5 }}>
        <FlatList
          data={ordersState}
          keyExtractor={(item) => item.id}
          renderItem={(itemData) => (
            <View
              style={{
                marginVertical: 5,
                padding: 10,
                backgroundColor: "white",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: "#1DA1F2",
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}
                  >
                    <Text>{itemData.item.quantity}</Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {itemData.item.foodname}
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {itemData.item.translatedFoodName}
                  </Text>
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

              <ScrollView style={{ flex: 1 }} horizontal={true}>
                <View style={styles.preferenceContainer}>
                  {itemData.item.preferences?.map((pref, index) => (
                    <View key={index} style={[styles.preference]}>
                      <Text style={[styles.preferenceText]}>
                        {pref.preferenceInLanguageOfDiner}
                      </Text>
                      <Text style={[styles.preferenceText]}>
                        {pref.preferenceInLanguageOfWaiter}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>

              <Text style={{ fontSize: 15, marginTop: 5, color: "red" }}>
                {itemData.item.extraInfo}
              </Text>

              {itemData.item.problemSolved &&
                itemData.item.options.map((option) => (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#1DA1F2",
                      borderRadius: 15,
                      paddingHorizontal: 20,
                      paddingVertical: 5,
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{ fontSize: 15, marginTop: 5, color: "white" }}
                    >
                      {option.optioninwaiterlanguage}
                    </Text>
                    <Text
                      style={{ fontSize: 15, marginTop: 5, color: "white" }}
                    >
                      {option.optionindinerlanguage}
                    </Text>
                  </TouchableOpacity>
                ))}

              <View style={styles.borderlineStyle}></View>
            </View>
          )}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Total</Text>
          <View>
            <Text style={{ fontWeight: "bold" }}>
              {convertFrom} {totalPrice?.totalOriginalPrice}
            </Text>
            <Text style={{ fontWeight: "bold" }}>
              {convertTo} {totalPrice?.totalPriceAfterConversion}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginHorizontal: 10, marginBottom: 10, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 25 }}>
              {translateToLanguage.name}
            </Text>
            {modificationNeeded && (
              <TouchableOpacity
                style={{
                  backgroundColor: "red",
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  borderRadius: 10,
                }}
                onPress={fixOrderPressHandler}
              >
                <Text
                  style={{ fontSize: 15, color: "white", fontWeight: "bold" }}
                >
                  Fix Order
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.translateContainer}>
            {loading ? (
              <SkeletonTemplate height={30} width={200} />
            ) : (
              <View style={{ flex: 1 }}>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  style={{ flex: 1 }}
                >
                  <Pressable onPress={goToEditText}>
                    <Text style={{ fontSize: 20 }}>{languageOfDiner}</Text>
                  </Pressable>
                </ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Pressable onPress={playDinerSound} style={{ marginTop: 10 }}>
                    <IconFeather name="volume-2" size={25} color="black" />
                  </Pressable>
                  <Pressable
                    style={{ marginRight: 5 }}
                    onPress={() => goToShowFullText(languageOfDiner)}
                  >
                    <AntDesignIcon name="arrowsalt" size={20} color="black" />
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={{ alignItems: "center" }}>
          <View style={styles.line} />
        </View>
        <View style={{ flex: 1 }}>
          <View>
            <Text
              style={{ fontWeight: "bold", fontSize: 25, color: "#1877F2" }}
            >
              {translateFromLanguage.name}
            </Text>
          </View>
          <View style={styles.translateContainer}>
            {loading ? (
              <SkeletonTemplate height={30} width={200} />
            ) : (
              <View style={{ flex: 1 }}>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  style={{ flex: 1 }}
                >
                  <Pressable onPress={goToWaiterEditText}>
                    <Text style={{ fontSize: 20, color: "#1877F2" }}>
                      {languageOfWaiter}
                    </Text>
                  </Pressable>
                </ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Pressable onPress={playWaiterSound}>
                    <IconFeather name="volume-2" size={25} color="#1877F2" />
                  </Pressable>
                  <Pressable
                    style={{ marginRight: 5 }}
                    onPress={() => goToShowFullText(languageOfWaiter)}
                  >
                    <AntDesignIcon name="arrowsalt" size={20} color="#1877F2" />
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={{ backgroundColor: "#d7effa" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginTop: 10,
          }}
        >
          <View
            style={{
              width: 150,
              backgroundColor: "white",
              height: 60,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 15 }}>{translateToLanguage.name}</Text>
          </View>
          <View
            style={{
              width: 150,
              backgroundColor: "white",
              height: 60,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 15 }}>{translateFromLanguage.name}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 40,
            marginBottom: 20,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            style={styles.micCircleContainer}
            onPressIn={startRecording}
            onPressOut={stopDinerRecording}
          >
            <IconFeather name="mic" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.micCircleContainer}
            onPressIn={startRecording}
            onPressOut={stopWaiterRecording}
          >
            <IconFeather name="mic" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  borderlineStyle: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
    marginTop: 10,
  },
  smallButtonStyle: {
    backgroundColor: "#1DA1F2",
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  micCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    backgroundColor: "#1DA1F2",
    borderRadius: 70 / 2,
    elevation: 8, // for Android shadow
  },
  line: {
    height: 2, // thickness of the line
    backgroundColor: "#1DA1F2", // color of the line
    width: 200,
    marginVertical: 10, // vertical margin for spacing
    opacity: 0.5, // opacity of the line
    marginHorizontal: 10, // horizontal margin for spacing
  },
  translateContainer: {
    marginTop: 10,
    flex: 1,
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
  preferenceText: {
    color: "#000",
  },
});
