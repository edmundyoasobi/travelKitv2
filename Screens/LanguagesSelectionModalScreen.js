import { useEffect , useState} from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import ISO6391 from 'iso-639-1';

const LanguagesSelectionModalScreen = ({ navigation, route }) => {
  const {  navigationTitle, setLanguage, selectedLanguage} = route.params;

  const [languages, setLanguages] = useState([
    { id: 1, name: 'Arabic', languageCode: 'ar' },
    { id: 2, name: 'Bengali', languageCode: 'bn' },
    { id: 3, name: 'Bulgarian', languageCode: 'bg' },
    { id: 4, name: 'Chinese', languageCode: 'zh' },
    { id: 5, name: 'Croatian', languageCode: 'hr' },
    { id: 6, name: 'Czech', languageCode: 'cs' },
    { id: 7, name: 'Danish', languageCode: 'da' },
    { id: 8, name: 'Dutch', languageCode: 'nl' },
    { id: 9, name: 'English', languageCode: 'en' },
    { id: 10, name: 'Estonian', languageCode: 'et' },
    { id: 11, name: 'Finnish', languageCode: 'fi' },
    { id: 12, name: 'French', languageCode: 'fr' },
    { id: 13, name: 'German', languageCode: 'de' },
    { id: 14, name: 'Greek', languageCode: 'el' },
    { id: 15, name: 'Hebrew', languageCode: 'iw' },
    { id: 16, name: 'Hindi', languageCode: 'hi' },
    { id: 17, name: 'Hungarian', languageCode: 'hu' },
    { id: 18, name: 'Indonesian', languageCode: 'id' },
    { id: 19, name: 'Italian', languageCode: 'it' },
    { id: 20, name: 'Japanese', languageCode: 'ja' },
    { id: 21, name: 'Korean', languageCode: 'ko' },
    { id: 22, name: 'Latvian', languageCode: 'lv' },
    { id: 23, name: 'Lithuanian', languageCode: 'lt' },
    { id: 24, name: 'Norwegian', languageCode: 'no' },
    { id: 25, name: 'Polish', languageCode: 'pl' },
    { id: 26, name: 'Portuguese', languageCode: 'pt' },
    { id: 27, name: 'Romanian', languageCode: 'ro' },
    { id: 28, name: 'Russian', languageCode: 'ru' },
    { id: 29, name: 'Serbian', languageCode: 'sr' },
    { id: 30, name: 'Slovak', languageCode: 'sk' },
    { id: 31, name: 'Slovenian', languageCode: 'sl' },
    { id: 32, name: 'Spanish', languageCode: 'es' },
    { id: 33, name: 'Swahili', languageCode: 'sw' },
    { id: 34, name: 'Swedish', languageCode: 'sv' },
    { id: 35, name: 'Thai', languageCode: 'th' },
    { id: 36, name: 'Turkish', languageCode: 'tr' },
    { id: 37, name: 'Ukrainian', languageCode: 'uk' },
    { id: 38, name: 'Vietnamese', languageCode: 'vi' }
  ]); 
  useEffect(() => {
    
    setLanguages((prevItems) =>
      prevItems.map((language) =>
        language.name == selectedLanguage ? {...language ,selected : true} : {...language ,selected : false}
      )
    );
    navigation.setOptions({ title: navigationTitle });
    
  }, []);

  const pressHanlder = (language) => {
    setLanguage(language);
    setLanguages((prevItems) =>
      prevItems.map((item) =>
        item.id === language.id ? { ...item, selected: true } :  { ...item, selected: false }
      )
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Select your language</Text>
      <View style={{ marginTop: 10, flex: 1 }}>
        <FlatList
        initialNumToRender={20}
          data={languages}
          renderItem={(itemData) => (
            <Pressable
              style={{
                backgroundColor: itemData.item.selected ? "lightblue" : null,
              }}
              onPress={()=>pressHanlder(itemData.item)}
            >
              <View style={{ marginVertical: 15, paddingLeft : 30 }} >
                <Text style={{ fontSize: 15 }}>{itemData.item.name}</Text>
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

export default LanguagesSelectionModalScreen;
