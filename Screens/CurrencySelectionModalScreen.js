import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import ISO3166 from "iso-3166-1";
import CountryFlag from "react-native-country-flag";

const CurrencySelectionModalScreen = ({ navigation, route }) => {
  const { navigationTitle, setCurrency, selectedCurrency } = route.params;

  const [currencyList, setCurrencyList] = useState([]);
  useEffect(() => {
    countryDetailsList = [
      { id: 7, currencyCode: "ARS", isoCode: "AR", selected: false },
      { id: 8, currencyCode: "AUD", isoCode: "AU", selected: false },

      { id: 18, currencyCode: "BND", isoCode: "BN", selected: false },

      { id: 20, currencyCode: "BRL", isoCode: "BR", selected: false },

      { id: 26, currencyCode: "CAD", isoCode: "CA", selected: false },
      { id: 27, currencyCode: "CDF", isoCode: "CD", selected: false },
      { id: 28, currencyCode: "CHF", isoCode: "CH", selected: false },

      { id: 30, currencyCode: "CNY", isoCode: "CN", selected: false },

      { id: 35, currencyCode: "CZK", isoCode: "CZ", selected: false },

      { id: 37, currencyCode: "DKK", isoCode: "DK", selected: false },

      { id: 40, currencyCode: "EGP", isoCode: "EG", selected: false },

      { id: 43, currencyCode: "EUR", isoCode: "EU", selected: false }, // European Union

      { id: 46, currencyCode: "FOK", isoCode: "FO", selected: false },
      { id: 47, currencyCode: "GBP", isoCode: "GB", selected: false },
      { id: 48, currencyCode: "GEL", isoCode: "GE", selected: false },

      { id: 56, currencyCode: "HKD", isoCode: "HK", selected: false },

      { id: 58, currencyCode: "HRK", isoCode: "HR", selected: false },
      { id: 59, currencyCode: "HTG", isoCode: "HT", selected: false },
      { id: 60, currencyCode: "HUF", isoCode: "HU", selected: false },
      { id: 61, currencyCode: "IDR", isoCode: "ID", selected: false },
      { id: 62, currencyCode: "ILS", isoCode: "IL", selected: false },
      { id: 63, currencyCode: "IMP", isoCode: "IM", selected: false },
      { id: 64, currencyCode: "INR", isoCode: "IN", selected: false },
      { id: 65, currencyCode: "IQD", isoCode: "IQ", selected: false },

      { id: 67, currencyCode: "ISK", isoCode: "IS", selected: false },

      { id: 69, currencyCode: "JMD", isoCode: "JM", selected: false },
      { id: 70, currencyCode: "JOD", isoCode: "JO", selected: false },
      { id: 71, currencyCode: "JPY", isoCode: "JP", selected: false },

      { id: 74, currencyCode: "KHR", isoCode: "KH", selected: false },

      { id: 78, currencyCode: "KWD", isoCode: "KW", selected: false },
      { id: 79, currencyCode: "KYD", isoCode: "KY", selected: false },

      { id: 93, currencyCode: "MOP", isoCode: "MO", selected: false },

      { id: 98, currencyCode: "MXN", isoCode: "MX", selected: false },
      { id: 99, currencyCode: "MYR", isoCode: "MY", selected: false },

      { id: 104, currencyCode: "NOK", isoCode: "NO", selected: false },
      { id: 105, currencyCode: "NPR", isoCode: "NP", selected: false },
      { id: 106, currencyCode: "NZD", isoCode: "NZ", selected: false },

      { id: 111, currencyCode: "PHP", isoCode: "PH", selected: false },

      { id: 113, currencyCode: "PLN", isoCode: "PL", selected: false },

      { id: 115, currencyCode: "QAR", isoCode: "QA", selected: false },

      { id: 117, currencyCode: "RSD", isoCode: "RS", selected: false },
      { id: 118, currencyCode: "RUB", isoCode: "RU", selected: false },

      { id: 124, currencyCode: "SEK", isoCode: "SE", selected: false },
      { id: 125, currencyCode: "SGD", isoCode: "SG", selected: false },
      { id: 126, currencyCode: "SHP", isoCode: "SH", selected: false },

      { id: 134, currencyCode: "THB", isoCode: "TH", selected: false },
      { id: 135, currencyCode: "TJS", isoCode: "TJ", selected: false },

      { id: 146, currencyCode: "USD", isoCode: "US", selected: false },
    ];
    const modifyCurrencyList = countryDetailsList.map((country) =>
      country.currencyCode === selectedCurrency.currencyCode
        ? { ...country, selected: true }
        : country
    );
    navigation.setOptions({ title: navigationTitle });
    setCurrencyList(modifyCurrencyList);
  }, []);

  const pressHanlder = (code) => {
    setCurrency(code);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Select your currency</Text>
      <View style={{ marginTop: 10, flex: 1 }}>
        <FlatList
        initialNumToRender={20}
          data={currencyList}
          renderItem={(itemData) => (
            <Pressable
              style={{
                backgroundColor: itemData.item.selected ? "lightblue" : null,
              }}
              onPress={() => pressHanlder({currencyCode: itemData.item.currencyCode, isoCode: itemData.item.isoCode})}
            >
              <View
                style={{
                  marginVertical: 15,
                  paddingLeft: 30,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CountryFlag
                  isoCode={itemData.item.isoCode}
                  style={{ borderRadius: 15, height: 30, width: 30 }}
                />

                <Text style={{ fontSize: 15, marginLeft: 20 }}>
                  {itemData.item.currencyCode}
                </Text>
              </View>
              <View style={styles.borderlineStyle}></View>
            </Pressable>
          )}
          keyExtractor={(item, index) => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  translateContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  borderlineStyle: {
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
  },
});

export default CurrencySelectionModalScreen;
