import { ArtTool, Brand } from "@/models";
import { getAllArtTool, getAllBrandName } from "@/services";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import ButtonCustom from "../ButtonCustom";
import SearchBarComponent from "../SearchBar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const navigation: any = useNavigation();
    const [artTool, setArtTool] = useState<ArtTool[]>([]);
    const [brand, setBrand] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [buttonColorWithBrandId, setButtonColorWithBrandId] = useState<string>('');
    const [countArtToolOfBrand, setCountArtToolOfBrand] = useState<number[]>([]);
    const [favorites, setFavorites] = useState<ArtTool[]>([]); 


    useFocusEffect(
        React.useCallback(() => {
            getAllArtToolFromHome();
            getAllBrandNameFromHome();
            loadFavoritesFromStorage();
        }, [])
    );

    useEffect(() => {
        if (brand.length > 0) {
            getCountArtToolsForBrands();
        }
    }, [brand]);

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

    const toggleFavorite = async (item: ArtTool) => {
        // Check if the item is already in favorites
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

    const getCountArtToolsForBrands = async () => {
        const promises = brand.map(async (element) => {
            return await countItemOfBrand(element.id);
        });

        const counts = await Promise.all(promises);
        setCountArtToolOfBrand(counts);
    };

    const countItemOfBrand = async (brandId: string): Promise<number> => {
        const res = await getAllArtTool();
        const countArtToolOfBrand = res.filter((item: ArtTool) => item.brandId === brandId);
        return countArtToolOfBrand.length;
    };

    const getAllArtToolFromHome = async () => {
        const res = await getAllArtTool();
        if (res) {
            setArtTool(res);
        }
        setButtonColorWithBrandId('');
        setLoading(false);
    };

    const getAllBrandNameFromHome = async () => {
        const res = await getAllBrandName();
        if (res) {
            setBrand(res);
        }
    };

    const filterBrand = async (brandId: string) => {
        setLoading(true);
        const res = await getAllArtTool();
        setArtTool(res.filter((item: ArtTool) => item.brandId === brandId));
        setButtonColorWithBrandId(brandId);
        setLoading(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading ...</Text>
            </View>
        );
    }

    return (
        <View style={{  flex: 1 }}>
            <Pressable onPress={() => navigation.navigate('SearchScreen')}>
                <SearchBarComponent />
            </Pressable>
            <View>
                <ScrollView >
                    <FlatList
                        style={{ paddingLeft: 10, paddingVertical: 8 }}
                        horizontal={true}
                        data={brand}
                        keyExtractor={item => item.id + ""}
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    {index === 0 && (
                                        <View style={styles.brandRow}>
                                            <ButtonCustom
                                                onPress={() => getAllArtToolFromHome()}
                                                title={"All"}
                                                isSelected={false}
                                            />
                                        </View>
                                    )}
                                    <View style={styles.brandRow}>
                                        <ButtonCustom
                                            onPress={() => filterBrand(item.id)}
                                            title={`${item.name} (${countArtToolOfBrand[index]})`}
                                            isSelected={item.id === buttonColorWithBrandId}
                                        />
                                    </View>
                                </>
                            );
                        }}
                    />
                </ScrollView>
            </View>
            {
                artTool.length === 0 &&
                <View style={styles.nodataContainer}>
                    <Entypo name="emoji-sad" size={48} color="black" />
                    <Text style={{ paddingTop: 10 }}>The brand does not have any products</Text>
                </View>
            }
            <View style={styles.renderList}>
                <FlatList
                    numColumns={2}
                    data={artTool}
                    keyExtractor={item => item.id + ""}
                    // contentContainerStyle={artTool.length > 2 && artTool.length %2 ===1 ? { paddingBottom: 0 } : null}
                    renderItem={({ item, index }) => {
                        return (
                            index < artTool.length - 1 ?
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
                                                            <AntDesign name="heart" size={24} color="black" /> // If in favorites, show black heart
                                                        ) : (
                                                            <AntDesign name="hearto" size={24} color="red" /> // If not in favorites, show outline heart
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
        </View>
    );
};

const styles = StyleSheet.create({
    brandname: {
        marginTop: 10
    },
    nodataContainer: {
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 220
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    renderList: {
        flexDirection: "row",
        backgroundColor: "#F0F0F0",
        paddingTop: 10
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
    name: {
        paddingHorizontal: 2,
        paddingTop: 10,
        fontWeight: "bold",
        fontSize: 18
    },
    brandRow: {
        flex: 1,
        margin: 3,
    },
    originalPrice: {
        padding: 10,
        textDecorationLine: "line-through",
    },
    discountPercentComponent: {
        padding: 0,
        backgroundColor: "#ffebeb",
        fontWeight: "bold",
        alignItems: "center",
        justifyContent: "center"
    },
    discountPercent: {
        color: "red",
        fontSize: 12,
    },
    discountPrice: {
        color: "red",
        fontSize: 18
    },
    heartIconContainer: {
        flex: 1,
        justifyContent: "flex-end"
    },
    imageBackground: {
        width: 150,
        height: 150,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default HomeScreen;
