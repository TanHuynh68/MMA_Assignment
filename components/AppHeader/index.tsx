import { StyleSheet, Text, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
interface HeaderProps {
    page?: string;
}

const Header = ({page}: HeaderProps) => {
    const navigation: any = useNavigation();
    if (page === "home") {
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>
                    Art Tool Page
                </Text>
            </View>
        )
    } else if (page === "favorite") {
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>
                    Favorite List
                </Text>
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>
                    Detail Page
                </Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#ccc",
        alignItems: "center",
        padding: 15
    },
    headerText: {
        flex: 1,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold"
    }
})
export default Header;