import { FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const SearchScreen = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const navigation: any = useNavigation();
    const [history, setHistory] = useState<SearchHistory[]>(searchHistory)
    const handleDeleteInputSearch = () => {
        setSearchInput('');
    }

    const handleInputFocus = () => {
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
                   autoFocus={true}
                    onBlur={() => Keyboard.dismiss()}
                />
                {
                    searchInput != '' &&
                    <Pressable style={styles.iconContainer} onPress={handleDeleteInputSearch}>
                        <View>
                            <FontAwesome6 name="x" size={16} color="black" />
                        </View>
                    </Pressable>
                }
            </View>
            <FlatList
                data={history}
                keyExtractor={item => item.id + ""}
                renderItem={({ item }) => {
                    return (
                        <Pressable
                            onPress={() => setSearchInput(item.keyword)}
                        >
                            <View
                                style={styles.containerSearchKeyWord}>
                                <Text style={styles.text}>
                                    {item.keyword}
                                </Text>
                            </View>
                        </Pressable>
                    )
                }}
            >

            </FlatList>

        </View>
    );
}

export default SearchScreen;


const styles = StyleSheet.create({
    containerSearchKeyWord: {
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 10,
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

interface SearchHistory {
    id: number,
    keyword: string,
    brandName: string,
    searchTime: string,
    status: string,
}
const searchHistory = [
    {
        id: 1,
        keyword: "Watercolor Brush",
        brandName: "Winsor & Newton",
        searchTime: "2024-09-28T10:45:00",
        status: "found"
    },
    {
        id: 2,
        keyword: "Acrylic Paint Set",
        brandName: "Liquitex",
        searchTime: "2024-09-28T11:15:00",
        status: "found"
    },
    {
        id: 3,
        keyword: "Graphite Pencils",
        brandName: "Faber-Castell",
        searchTime: "2024-09-28T11:30:00",
        status: "not found"
    },
    {
        id: 4,
        keyword: "Oil Pastels",
        brandName: "Sennelier",
        searchTime: "2024-09-28T12:00:00",
        status: "found"
    },
    {
        id: 5,
        keyword: "Charcoal Sticks",
        brandName: "General's",
        searchTime: "2024-09-28T12:30:00",
        status: "found"
    },
    {
        id: 6,
        keyword: "Canvas Pad",
        brandName: "Strathmore",
        searchTime: "2024-09-28T13:00:00",
        status: "not found"
    },
    {
        id: 7,
        keyword: "Palette Knife",
        brandName: "Artisan",
        searchTime: "2024-09-28T13:15:00",
        status: "found"
    },
    {
        id: 8,
        keyword: "Sketchbook",
        brandName: "Moleskine",
        searchTime: "2024-09-28T13:45:00",
        status: "found"
    },
    {
        id: 9,
        keyword: "Calligraphy Pen",
        brandName: "Pilot",
        searchTime: "2024-09-28T14:00:00",
        status: "found"
    },
    {
        id: 10,
        keyword: "Colored Pencils",
        brandName: "Prismacolor",
        searchTime: "2024-09-28T14:30:00",
        status: "not found"
    }
];
