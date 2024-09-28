import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const SearchScreen = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const navigation: any = useNavigation();

    const handleDeleteInputSearch = () => {
        setSearchInput('');
    }

    const handleInputFocus = () => {
        // Bạn có thể thêm hành động bạn muốn khi TextInput được nhấn vào đây
        console.log("TextInput được nhấn vào");
    }

    return (
        <View>
            <View style={styles.containerSearch}>
                <TextInput
                    value={searchInput}
                    onChangeText={setSearchInput}
                    style={styles.textInput}
                    placeholder="Search"
                    onFocus={handleInputFocus} // Sử dụng onFocus để xử lý khi bấm vào TextInput
                    onBlur={() => Keyboard.dismiss()} // Ẩn bàn phím khi không còn focus
                />
                {
                    searchInput != '' &&
                    <Pressable style={styles.iconContainer} onPress={handleDeleteInputSearch}>
                        <View>a
                            <FontAwesome6 name="x" size={16} color="black" />
                        </View>
                    </Pressable>
                }
            </View>
            <View style={styles.containerSearchKeyWord}>
                <Text style={styles.text}>
                    SearchScreen
                </Text>
            </View>
        </View>
    );
}

export default SearchScreen;

const styles = StyleSheet.create({
    containerSearchKeyWord: {
        paddingHorizontal: 15
    },
    text: {
        paddingVertical: 5
    },
    containerSearch: {
        borderRadius: 10,
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
        paddingRight: 35,
    },
    iconContainer: {
        position: "absolute",
        right: 15,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
});
