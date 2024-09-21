import { StyleSheet, Text, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
const Header = () => {
    const navigation:any = useNavigation();
    return (
        <View style={styles.container}>
            <MaterialIcons
            onPress={()=>navigation.openDrawer()}
            name="menu" size={24} color="black" />
            <Text style={styles.headerText}>Art Tool Page</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#ccc",
        alignItems: "center",
        padding: 15
    },
    headerText:{
        flex:1,
        textAlign: "center",
        fontSize:20,
        fontWeight: "bold"
    }
})
export default Header;