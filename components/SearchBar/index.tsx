import { StyleSheet, TextInput, View } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from "react";
import { useNavigation } from "expo-router";

const SearchBarComponent = () => {
    const navigation: any = useNavigation();
    return (
        <View style={styles.container}>
            <TextInput
                onPress={()=>navigation.navigate('SearchScreen')}
                style={styles.textInput} placeholder="Search" />
        </View>
    )
}

export default SearchBarComponent;

const styles = StyleSheet.create({
    container: {
        borderRadius: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        marginHorizontal: 10,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        position: "relative",
    },
    textInput: {
        flex: 1,
        paddingVertical: 10,
        paddingRight: 35, // Thêm padding phải để không chèn vào icon
    },
    iconContainer: {
        position: "absolute",
        right: 15,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
});
