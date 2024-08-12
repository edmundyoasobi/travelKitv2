import { useEffect, useState } from "react";
import currencyCodes from "currency-codes";
import CountryFlag from "react-native-country-flag";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import { LogBox } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../store/auth-context";

import {
  View,
  Button,
  Image,
  StyleSheet,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MeterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import IPADDRESS from "../IpAddress";
import axios from "axios";
import SkeletonTemplate from "../Components/SkeletonTemplate";

const MenuImageUploadScreen = ({ navigation }) => {
  //generate a list of languages
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    console.log(authCtx.userUUID);
    LogBox.ignoreAllLogs(); // Ignore all log notifications
  }, []);
  const [translateFromLanguage, settranslateFromLanguage] = useState({
    name: "English",
    languageCode: "en",
  });
  const [translateToLanguage, settranslateToLanguage] = useState({
    name: "Japanese",
    languageCode: "ja",
  });
  const [isInferingLanguageAndCurrency, setIsInferingLanguageAndCurrency] =
    useState(false);
  const [convertFrom, setConvertFrom] = useState({
    currencyCode: "USD",
    isoCode: "US",
  });
  const [convertTo, setConvertTo] = useState({
    currencyCode: "JPY",
    isoCode: "JP",
  });
  const [imageToInfer, setImage] = useState(null);

  const [isFoodMenu, setIsFoodMenu] = useState(false);

  const pickImage = async () => {
    // Request permission to access the camera and media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Allow user to choose image from camera or gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setIsInferingLanguageAndCurrency(true);
      setImage(result);
      uploadImage(result);
    }
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setIsInferingLanguageAndCurrency(true);
      setImage(result);
      uploadImage(result);
    }
  };

  const navigationButtonPressHanlder = () => {
    console.log(convertFrom, convertTo);
    navigation.navigate("MenuReaderScreen", {
      image: imageToInfer,
      translateFromLanguage: translateFromLanguage,
      translateToLanguage: translateToLanguage,
      convertFrom: convertFrom.currencyCode,
      convertTo: convertTo.currencyCode,
    });
  };

  const uploadImage = async (imageToInfer) => {
    if (!imageToInfer) return;

    const formData = new FormData();
    formData.append("file", {
      uri: imageToInfer["assets"][0]["uri"],
      name: "IMG_30002.jpg",
      type: imageToInfer["assets"][0]["mimeType"],
    });

    axios
      .post(
        "https://travelkitbackend.onrender.com/inferLanguageAndCurrency",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if (response.data.isFoodMenu) {
          setConvertFrom({
            currencyCode: response.data.currencyCode,
            isoCode: response.data.isoCode,
          });
          settranslateFromLanguage({
            name: response.data.language,
            languageCode: response.data.languageCode,
          });
          console.log(response.data);
          setIsInferingLanguageAndCurrency(false);
          setIsFoodMenu(true);
        } else {
          setIsInferingLanguageAndCurrency(false);
          alert(
            "The image you uploaded is not a food menu. Please upload an image of a food menu"
          );
        }
      })
      .catch((error) => {
        alert("Network error . Please try again");
        setIsInferingLanguageAndCurrency(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        {imageToInfer ? (
          <Image
            source={{ uri: imageToInfer["assets"][0]["uri"] }}
            style={{ width: 400, height: 500 }}
          />
        ) : (
          <Text
            style={{ fontSize: 20, textAlign: "center", marginVertical: 20 }}
          >
            Take a picture or upload an image of the menu
          </Text>
        )}
      </View>
      <View style={{ backgroundColor: "#d7effa" }}>
        <View
          style={[
            {
              marginTop: 10,
              marginHorizontal: 20,
            },
            styles.row,
          ]}
        >
          <TouchableOpacity
            style={{
              width: 150,
              backgroundColor: "white",
              height: 60,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            disabled={isInferingLanguageAndCurrency}
            onPress={() =>
              navigation.navigate("LanguagesSelectionModalScreen", {
                navigationTitle: "Translate From",
                setLanguage: settranslateFromLanguage,
                selectedLanguage: translateFromLanguage,
              })
            }
          >
            {isInferingLanguageAndCurrency ? (
              <SkeletonTemplate height={30} width={80} />
            ) : (
              <Text style={{ fontSize: 15 }}>{translateFromLanguage.name}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 150,
              backgroundColor: "white",
              height: 60,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              navigation.navigate("LanguagesSelectionModalScreen", {
                navigationTitle: "Translate To",
                setLanguage: settranslateToLanguage,
                selectedLanguage: translateToLanguage,
              })
            }
          >
            <Text style={{ fontSize: 15 }}>{translateToLanguage.name}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center" }}>
          <AntDesignIcon name="arrowright" size={30} color="black" />
        </View>
        <View
          style={[
            {
              marginBottom: 20,
              marginHorizontal: 20,
            },
            styles.row,
          ]}
        >
          <TouchableOpacity
            style={{
              width: 150,
              backgroundColor: "white",
              height: 60,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              navigation.navigate("CurrencySelectionModalScreen", {
                navigationTitle: "Convert From",
                setCurrency: setConvertFrom,
                selectedCurrency: convertFrom,
              })
            }
          >
            {isInferingLanguageAndCurrency ? (
              <SkeletonTemplate height={30} width={80} />
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CountryFlag
                  isoCode={convertFrom.isoCode}
                  style={{ borderRadius: 15, height: 30, width: 30 }}
                />

                <Text style={{ fontSize: 15, marginLeft: 20 }}>
                  {convertFrom.currencyCode}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 150,
              backgroundColor: "white",
              height: 60,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              navigation.navigate("CurrencySelectionModalScreen", {
                navigationTitle: "Convert To",
                setCurrency: setConvertTo,
                selectedCurrency: convertTo,
              })
            }
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <CountryFlag
                isoCode={convertTo.isoCode}
                style={{ borderRadius: 15, height: 30, width: 30 }}
              />

              <Text style={{ fontSize: 15, marginLeft: 20 }}>
                {convertTo.currencyCode}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={[
            {
              marginBottom: 50,
              marginHorizontal: 50,
            },
            styles.row,
          ]}
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity style={styles.circle} onPress={pickImage}>
              <MeterialCommunityIcons
                name="image-outline"
                size={22}
                color="black"
              />
            </TouchableOpacity>
            <Text>Gallery</Text>
          </View>

          {imageToInfer && isFoodMenu && !isInferingLanguageAndCurrency && (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity
                style={styles.circle}
                onPress={navigationButtonPressHanlder}
              >
                <Ionicons name="analytics" size={22} color="black" />
              </TouchableOpacity>
              <Text>Analyse Menu</Text>
            </View>
          )}
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity style={styles.circle} onPress={takePicture}>
              <MeterialCommunityIcons
                name="camera-wireless-outline"
                size={22}
                color="black"
              />
            </TouchableOpacity>
            <Text>Camera</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fill: {
    flex: 1,
    margin: 15,
  },
});

export default MenuImageUploadScreen;
