import React, { useEffect, useState } from "react";
import { Button, FlatList, Image, Pressable, StyleSheet, Text, View, Alert, TextInput } from "react-native";
import { CheckBox } from '@rneui/themed';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler'; // Import Swipeable
import { ArtTool } from "@/models";

const FavoritesListScreen = () => {
    const navigation: any = useNavigation();
    const [artTool, setArtTool] = useState<ArtTool[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkBox, setCheckBox] = useState<boolean>(false);
    const [artToolChecked, setArtToolChecked] = useState<string[]>([]);
    const [artToolFilter, setArtToolFilter] = useState<ArtTool[]>([]);
    useFocusEffect(
        React.useCallback(() => {
            loadFavoritesFromStorage();

        }, [])
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            navigation.getParent()?.setOptions({
                tabBarStyle: {
                    display: "flex" // Hiển thị lại Bottom Tab
                }
            });
        });

        return unsubscribe;
    }, [navigation]);

    const loadFavoritesFromStorage = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            if (storedFavorites) {
                const parsedFavorites = JSON.parse(storedFavorites);
                const validFavorites = parsedFavorites.filter((item: ArtTool) => item != null);
                setArtTool(validFavorites);
                setArtToolFilter(validFavorites)
            }
        } catch (error) {
            console.error("Error loading favorites from AsyncStorage: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckBox = (id: string) => {
        if (artToolChecked.includes(id)) {
            const updatedChecked = artToolChecked.filter(item => item !== id);
            setArtToolChecked(updatedChecked);
            saveFavoritesToStorage(updatedChecked);
        } else {
            const updatedChecked = [...artToolChecked, id];
            setArtToolChecked(updatedChecked);
            saveFavoritesToStorage(updatedChecked);
        }
    };

    const saveFavoritesToStorage = async (favorites: string[]) => {
        try {
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error("Error saving favorites to AsyncStorage: ", error);
        }
    };

    const renderRightActions = (item: ArtTool) => {
        return (
            <View style={styles.deleteButtonContainer}>
                <Button
                    title="Delete"
                    color="red"
                    onPress={() => handleDeleteItem(item.id)}
                />
            </View>
        );
    };

    const handleDeleteItem = async (id: string) => {
        const updatedFavorites = artTool.filter((item) => item.id !== id);
        setArtTool(updatedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        loadFavoritesFromStorage();
    };

    const handleCheckAll = () => {
        if (checkBox === false) {
            setCheckBox(true);
            const allIds = artTool.map((item) => item.id);
            setArtToolChecked(allIds);
            saveFavoritesToStorage(allIds);
        } else {
            setCheckBox(false);
            setArtToolChecked([]);
            saveFavoritesToStorage([]);
        }
    };

    const handleDelete = async () => {
        if (artToolChecked.length >= 2) {
            Alert.alert(
                "Confirm Deletion",
                `Are you sure you want to delete ${artToolChecked.length} items?`,
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Delete",
                        onPress: async () => {
                            const updatedFavorites = artTool.filter((item: ArtTool) => {
                                return !artToolChecked.includes(item.id);
                            });
                            setArtToolChecked([]);
                            setCheckBox(false);
                            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                            setArtTool(updatedFavorites);
                            loadFavoritesFromStorage();
                        },
                        style: "destructive"
                    }
                ],
                { cancelable: false }
            );
        } else {
            const updatedFavorites = artTool.filter((item: ArtTool) => {
                return !artToolChecked.includes(item.id);
            });
            setArtToolChecked([]);
            setCheckBox(false);
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setArtTool(updatedFavorites);
            loadFavoritesFromStorage();
        }
    };
    
    

    const handleChangeText = (text: string) => {
        console.log("text: ", text)
        setArtToolFilter(artTool.filter(item => item.name.toLocaleLowerCase().includes(text.toLocaleLowerCase())));
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading ...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    onChangeText={handleChangeText}
                    style={styles.textInput}
                    placeholder="Search"
                />
            </View>
            <FlatList
                data={artToolFilter}
                keyExtractor={item => item.id + ""}
                contentContainerStyle={{ paddingBottom: 150 }} // Thêm padding để tránh bị footer che
                renderItem={({ item }) => (
                    <GestureHandlerRootView key={item.id} style={{ flex: 1 }}>
                        <Swipeable renderRightActions={() => renderRightActions(item)}>
                            <View style={styles.row}>
                                <CheckBox
                                    onPress={() => handleCheckBox(item?.id)}
                                    checked={artToolChecked.includes(item?.id)}
                                    size={24}
                                />
                                <Pressable
                                    onPress={() => navigation.navigate('Detail', { item: item, page: "favorite" })}
                                >
                                    <Image
                                        resizeMode="cover"
                                        style={{ width: 160, height: 100 }}
                                        source={{ uri: item?.image }}
                                    />
                                </Pressable>
                                <View style={{ flex: 1, paddingLeft: 10, paddingBottom: 30 }}>
                                    <Text numberOfLines={1}>{item?.name}</Text>
                                    <Text>{item?.brandName}</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ paddingRight: 10, fontSize: 20, color: "red" }}>
                                            ${(item?.price - item?.discount * item?.price / 100).toFixed(2)}
                                        </Text>
                                        <Text style={{ paddingTop: 5, textDecorationLine: "line-through" }}>
                                            ${item?.price}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </Swipeable>
                    </GestureHandlerRootView>

                )}
            />
            <View style={styles.footer}>
                <View style={{ flex: 1 }}>
                    <CheckBox
                        onPress={handleCheckAll}
                        checked={checkBox}
                        size={24}
                    />
                    <Text style={{ paddingBottom: 5, flex: 1, textAlign: "center" }}>(Select all)</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {artToolChecked.length >= 1 && (
                        <Button onPress={() => handleDelete()} title={`Delete ${artToolChecked.length} items`} />
                    )}
                </View>
                <View style={{ flex: 3 }}></View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        borderRadius: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        position: "relative",
        marginBottom: 10,
        backgroundColor: "white",
    },
    textInput: {
        flex: 1,
        paddingVertical: 10,
        paddingRight: 35,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: -1,
        right: 0,
        backgroundColor: "white",
        width: "110%",
        height: 100,
        justifyContent: "center",
        borderWidth: 2,
        borderTopColor: "#ccc",
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 5,
        flex:1
    },
    container: {
        flex: 1, // Để nội dung có thể cuộn bên dưới FlatList
        padding: 10
    },
    row: {
        flexDirection: "row",
        paddingVertical: 30,
        justifyContent: "space-between",
        alignItems: "center",
        margin: 5,
        borderColor: "#ccc",
        borderWidth: 1,
        backgroundColor: "white"
    },
    titleScreen: {
        fontWeight: "bold"
    },
    deleteButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        backgroundColor: 'red',
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    }
});

export default FavoritesListScreen;
