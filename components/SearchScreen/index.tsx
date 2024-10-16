import { FlatList, ImageBackground, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { getAllKeyWordsOfHistory, newKeyword } from "@/services/search.service";
import { ArtTool, SearchHistory } from "@/models";
import LoadingComponent from "../loading";
import { getAllArtTool } from "@/services";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchScreen = () => {
    const navigation: any = useNavigation();
    const [searchInput, setSearchInput] = useState<string>('');
    const [history, setHistory] = useState<SearchHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSelectedKeyWord, setIsSelectedKeyword] = useState<boolean>(false);
    const [artTool, setArtTool] = useState<ArtTool[]>([]);
    const [artToolFilter, setArtToolFilter] = useState<ArtTool[]>([]);
    const [favorites, setFavorites] = useState<ArtTool[]>([]);
    useEffect(() => {
        getAllHistoryFromSearchScreen();
        getAllArtToolFromHome();
        loadFavoritesFromStorage();
    }, []);
    const loadFavoritesFromStorage = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            if (storedFavorites) {
                try {
                    const parsedFavorites = JSON.parse(storedFavorites);
                    console.log("home: ", parsedFavorites);

                    // Lọc bỏ các mục không hợp lệ
                    const validFavorites = parsedFavorites.filter((item: ArtTool) => item != null);
                    setFavorites(validFavorites);
                } catch (parseError) {
                    console.error("Error parsing favorites JSON: ", parseError);
                }
            } else {
                setFavorites([]);
                console.log("Home -No favorites found in AsyncStorage.");
            }
        } catch (error) {
            console.error("Error loading favorites from AsyncStorage: ", error);
        } finally {
            setLoading(false); // Đảm bảo trạng thái loading luôn được cập nhật
        }
    };
    useEffect(() => {
        if (searchInput != "") {
            // Filter art tools only after selecting or submitting a keyword
            if (isSelectedKeyWord) {
                setArtToolFilter(artTool.filter(item => item.name.toLowerCase().includes(searchInput.toLowerCase())));
            } else {
                // Filter history as user types
                setHistory(prevHistory => prevHistory.filter(item => item.keyword.toLowerCase().includes(searchInput.toLowerCase())));
            }
        } else if (searchInput === "") {
            // Show all history when the input is cleared
            getAllHistoryFromSearchScreen();
            setArtToolFilter([]);
        }
    }, [searchInput, isSelectedKeyWord]);

    const getAllArtToolFromHome = async () => {
        const res = await getAllArtTool();
        if (res) {
            setArtTool(res);
        }
        setLoading(false);
    };

    // Fetch all search history
    const getAllHistoryFromSearchScreen = async () => {
        setLoading(true);
        const res = await getAllKeyWordsOfHistory();
        if (res) {
            setHistory(res);
        }
        setLoading(false);
    };

    // Show loading screen while loading data
    // if (loading) {
    //     return <LoadingComponent />;
    // }

    // Clear the search input and reset the selected keyword state
    const handleDeleteInputSearch = () => {
        setSearchInput('');
        setIsSelectedKeyword(false);
        getAllHistoryFromSearchScreen();
    };

    // Handle when a search keyword is selected
    const handleSelectedInput = (keyword: string) => {
        Keyboard.dismiss();
        setSearchInput(keyword);
        setIsSelectedKeyword(true);
    };

    // Submit the search keyword
    const handleSubmitKeyword = async (event: any) => {
        const keyword = event.nativeEvent.text;
        console.log("keyword:", keyword);
        // Nếu không có từ khóa nào được nhập, hiển thị lại lịch sử tìm kiếm
        if (keyword.trim() === "") {
            setIsSelectedKeyword(false);
            getAllHistoryFromSearchScreen();
        } else {
            console.log('Search submitted for:', keyword);
            setSearchInput(keyword);
            setIsSelectedKeyword(true);

            // Thêm từ khóa mới vào lịch sử nếu không có sẵn
            const findKeyword = await getAllKeyWordsOfHistory(keyword);
            if (findKeyword.length === 0) {
                const res = await newKeyword(keyword, 0);
                console.log("New keyword added:", res);
            }
        }
    };


    const handleOnchangeText = (text: string) => {
        setSearchInput(text);
        console.log("text:", text)
    };
    const toggleFavorite = async (item: ArtTool) => {

        const updatedFavorites = favorites.find(fav => fav?.id === item.id)
            ? favorites.filter(fav => fav?.id !== item.id) // Remove from favorites
            : [...favorites, item]; // Add to favorites

        try {
            // Save updated favorites to AsyncStorage
            console.log("updatedFavorites: ", updatedFavorites)
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            // Update state
            setFavorites(updatedFavorites);
        } catch (error) {
            console.error("Error updating favorites: ", error);
        }
    };
    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
 
            <View style={styles.containerSearch}>
                <TextInput
                    autoCapitalize="none"
                    onChangeText={handleOnchangeText}  
                    value={searchInput}
                    style={styles.textInput}
                    placeholder="Search"
                    autoFocus={true}
                    onSubmitEditing={handleSubmitKeyword}
                />


                {searchInput !== '' && (
                    <Pressable style={styles.iconContainer} onPress={handleDeleteInputSearch}>
                        <FontAwesome6 name="x" size={16} color="black" />
                    </Pressable>
                )}
            </View>


            {!isSelectedKeyWord && (
                <FlatList
                    data={history.slice(0, 10)}
                    keyExtractor={item => item.id.toString()}

                    renderItem={({ item }) => (
                        <Pressable onPress={() => handleSelectedInput(item.keyword)}>
                            <View style={styles.containerSearchKeyWord}>
                                <Text style={styles.text}>{item.keyword}</Text>
                            </View>
                        </Pressable>
                    )}
                />
            )}

            {isSelectedKeyWord && (
                <View style={styles.renderList}>
                    <FlatList
                        numColumns={2}
                        data={artToolFilter}
                        keyExtractor={item => item.id + ""}
                        contentContainerStyle={artToolFilter.length >= 3 && artTool.length %2 ===1 ? { paddingBottom: 200 } : null}
                        renderItem={({ item, index }) => {
                            return (
                                index < artToolFilter.length - 1 ?
                                    <View style={styles.row}>
                                        <Pressable
                                            onPress={() => navigation.navigate('Detail', { item: item, page: "home" })}
                                        >
                                            <ImageBackground
                                                resizeMode="cover"
                                                style={styles.imageBackground}
                                                source={{ uri: item?.image }}
                                            />
                                        </Pressable>
                                        <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
                                        <Text style={styles.brandname} numberOfLines={2}>{item.brandName}</Text>
                                        <View style={{ flex: 1, justifyContent: "flex-end" }}>
                                            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                    <View>
                                                        <Text style={styles.discountPrice}>${(item.price - item.price * item.discount / 100).toFixed(2)}</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.originalPrice}>${item.price}</Text>
                                                <View style={styles.discountPercentComponent}>
                                                    <Text style={styles.discountPercent}>-{item.discount}%</Text>
                                                </View>
                                                <View >
                                                    <TouchableOpacity
                                                        style={{ paddingLeft: 10 }}
                                                        onPress={() => toggleFavorite(item)}>
                                                        {
                                                            favorites.find(fav => fav?.id === item.id) ? (
                                                                <AntDesign name="heart" size={24} color="red" /> 
                                                            ) : (
                                                                <AntDesign name="hearto" size={24} color="red" /> 
                                                            )
                                                        }
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    :
                                    <View style={styles.renderLastElement}>
                                        <Pressable
                                            onPress={() => navigation.navigate('Detail', { item: item, page: "home" })}
                                        >
                                            <ImageBackground
                                                resizeMode="cover"
                                                style={styles.imageBackground}
                                                source={{ uri: item?.image }}
                                            />
                                        </Pressable>
                                        <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
                                        <View>
                                            <Text style={styles.brandname}>{item.brandName}</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: "flex-end" }}>
                                            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                    <View>
                                                        <Text style={styles.discountPrice}>${(item.price - item.price * item.discount / 100).toFixed(2)}</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.originalPrice}>${item.price}</Text>
                                                <View style={styles.discountPercentComponent}>
                                                    <Text style={styles.discountPercent}>-{item.discount}%</Text>
                                                </View>
                                                <View >
                                                    <TouchableOpacity
                                                        style={{ paddingLeft: 10 }}
                                                        onPress={() => toggleFavorite(item)}>
                                                        {
                                                            favorites.find(fav => fav?.id === item.id) ? (
                                                                <AntDesign name="heart" size={24} color="red" /> 
                                                            ) : (
                                                                <AntDesign name="hearto" size={24} color="red" /> 
                                                            )
                                                        }
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                            );
                        }}
                    />
                </View>
            )}
        </View>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    brandname: {
        marginTop: 10
    },
    containerSearchKeyWord: {
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 10,
    },
    text: {
        paddingVertical: 5,
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
        marginBottom: 10
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
    renderList: {
        flexDirection: "row",
        backgroundColor: "#F0F0F0",
        paddingTop: 10
    },
    row: {
        flex: 1,
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 5,
        marginRight: 5,

        backgroundColor: "white",
        height: 300,
    },
    renderLastElement: {
        width: "49%",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 5,
        backgroundColor: "white",
        height: 300,
    },
    name: {
        paddingHorizontal: 2,
        paddingTop: 10,
        fontWeight: "bold",
        fontSize: 18
    },
    originalPrice: {
        padding: 10,
        textDecorationLine: "line-through",
    },
    discountPercentComponent: {
        backgroundColor: "#ffebeb",
        alignItems: "center",
        justifyContent: "center",
    },
    discountPercent: {
        color: "red",
        fontSize: 12,
    },
    discountPrice: {
        color: "red",
        fontSize: 16,
    },
    heartIconContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
    imageBackground: {
        width: 150,
        height: 150,
        justifyContent: "center",
        alignItems: "center"
    }
});
