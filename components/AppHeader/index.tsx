import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
    page?: string;
    page2?: string;
}

const Header = ({ page, page2 }: HeaderProps) => {
    const navigation = useNavigation();

    // const backToScreen = () => {
    //     navigation.navigate("Favorite-List"); // Đổi tên này thành tên route thực tế của bạn cho màn hình yêu thích
    //     console.log("clicked");
    // }

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
    } else { // Trang chi tiết
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
