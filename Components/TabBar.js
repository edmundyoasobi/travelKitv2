import { StyleSheet,View, Pressable, Text } from "react-native";

function TabBar(props){
  
    return (
        <View style={[styles.tabView]}>
        <View style={{flex:1}}>
          <Pressable style={[styles.tabViewButton, props.selectedTab == 0? styles.activeButton : null]} onPress={()=>props.tabPressHanlder(0)}>
            <Text style={{ fontWeight: "bold", fontSize: 13 }}>
              Dates (MM/DD)
            </Text>
          </Pressable>
        </View>

        <View style={{flex:1}}>
          <Pressable  style={[styles.tabViewButton, props.selectedTab == 1? styles.activeButton : null]} onPress={()=>props.tabPressHanlder(1)}>
            <Text style={{ fontWeight: "bold", fontSize: 13 }}>
              Trip Length
            </Text>
          </Pressable>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    tabView: {
        flexDirection: "row",
        backgroundColor: "#D3D3D3",
        paddingVertical: 3,
        borderRadius: 30,
        paddingHorizontal: 3,
        height: 50,
        
      },
      tabViewButton: {
        flex: 1,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
      },
      activeButton: {
        backgroundColor: 'white',
      },
});

export default TabBar;