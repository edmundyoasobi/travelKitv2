import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useEffect, useState } from "react";

const FixOrderModalScreen = ({ route, navigation }) => {
  const { orders, fixOrderCallBack } = route.params;

  useEffect(() => {
    console.log(orders);
  }, []);

  const [orderState, setOrderState] = useState(orders);

  const handleSelect = (id, index) => {
    setOrderState(prevState =>
      prevState.map(order => {
        if (order.id === id) {
          const newOptions = order.options.map((option, i) => ({
            ...option,
            selected: i === index ? !option.selected : false,
          }));
          return { ...order, options: newOptions };
        }
        return order;
      })
    );
  };
  return (
    <View style={styles.screen}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={orderState}
          keyExtractor={(item) => item.id}
          renderItem={(itemData) => (
            <View>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                {itemData.item.translatedFoodName} ({itemData.item.foodname})
              </Text>

              <Text
                style={{
                  fontSize: 15,
                  marginTop: 5,
                  color: "red",
                  marginBottom: 10,
                }}
              >
                {itemData.item.extraInfo}
              </Text>
              {itemData.item.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelect(itemData.item.id, index)}
                  style={{
                    backgroundColor: option.selected ? "#0a74da" : "#1DA1F2",
                    borderRadius: 15,
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: 15, marginTop: 5, color: "white" }}>
                    {option.optioninwaiterlanguage}
                  </Text>
                  <Text style={{ fontSize: 15, marginTop: 5, color: "white" }}>
                    {option.optionindinerlanguage}
                  </Text>
                </TouchableOpacity>
              ))}
              <Text style={{ fontSize: 15, marginTop: 5, marginBottom: 5 }}>
                Other
              </Text>
              <View
                style={{
                  borderColor: "#D3D3D3",
                  borderRadius: 15,
                  borderWidth: 1,
                  paddingVertical: 20,
                  paddingLeft: 10,
                }}
              >
                <TextInput placeholder="Include any extra info"></TextInput>
              </View>
            </View>
          )}
        />
      </View>

      <View style={{ marginBottom: 30 }}>
        <TouchableOpacity
            onPress={() => {fixOrderCallBack(orderState) 
                navigation.goBack()}}
          style={{
            backgroundColor: "#1DA1F2",
            paddingVertical: 20,
            borderRadius: 20,
            alignItems: "center",
            marginHorizontal: 25,
          }}
        >
          <Text style={{ fontSize: 15, color: "white", fontWeight: "bold" }}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
});

export default FixOrderModalScreen;
