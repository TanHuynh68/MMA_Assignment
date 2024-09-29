import { ArtTool, Brand } from "@/models";
import { getAllArtTool, getAllBrandName, updateStatusArtTool } from "@/services";
import { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import ButtonCustom from "../ButtonCustom";
import SearchBarComponent from "../SearchBar";
import { useNavigation } from "@react-navigation/native";
import { Rating, AirbnbRating } from 'react-native-ratings';
const HomeScreen = ({ }) => {
    const navigation: any = useNavigation();
    const [artTool, setArtTool] = useState<ArtTool[]>([]);
    const [brand, setBrand] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [buttonColorWithBrandId, setButtonColorWithBrandId] = useState<string>('');
    const [countArtToolOfBrand, setCountArtToolOfBrand] = useState<number[]>([]);

    useEffect(() => {
        getAllArtToolFromHome();
        getAllBrandNameFromHome();
    }, []);

    useEffect(() => {
        if (brand.length > 0) {
            getCountArtToolsForBrands();
        }
    }, [brand]);

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

    const setStatus = async (id: string) => {
        const currentItem = artTool.find(item => item.id === id);
        if (currentItem) {
            const newStatus = !currentItem.status;
            try {
                const updatedItem = await updateStatusArtTool(id, newStatus);
                setArtTool(artTool.map(item => item.id === id ? { ...item, status: updatedItem.status } : item));
                getAllArtToolFromHome();
            } catch (error) {
                console.error("Error updating status: ", error);
            }
        }
    };

    const filterBrand = async (brandId: string) => {
        setLoading(true);
        const res = await getAllArtTool();
        setArtTool(res.filter((item: ArtTool) => item.brandId === brandId));
        setButtonColorWithBrandId(brandId);
        setLoading(false);
        console.log("count", artTool.length)
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading ...</Text>
            </View>
        );
    }

    return (
        <View style={{ backgroundColor: "white" }}>
            <Pressable onPress={() => navigation.navigate('SearchScreen')}>
                <SearchBarComponent />
            </Pressable>
            <View>
                <ScrollView>
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
                    <Text
                        style={{ paddingTop: 10 }}
                    >The brand does not have any products</Text>
                </View>
            }
            <View style={styles.renderList}>
                <FlatList
                    numColumns={2}
                    data={artTool}
                    keyExtractor={item => item.id + ""}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.row}>
                                <Pressable
                                    onPress={() => navigation.navigate('Detail', { item: item, page: "home" })}
                                >
                                    <ImageBackground
                                        resizeMode="cover"
                                        style={styles.imageBackground}
                                        source={{ uri: item?.image }}
                                    >
                                    </ImageBackground>
                                </Pressable>
                                <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
                                <View style={styles.heartIconContainer}>
                                    <TouchableOpacity>
                                        {
                                            item.status === true ? (
                                                <AntDesign onPress={() => setStatus(item.id)} name="heart" size={24} color="red" />
                                            ) : (
                                                <AntDesign onPress={() => setStatus(item.id)} name="hearto" size={24} color="red" />
                                            )
                                        }
                                    </TouchableOpacity>
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
        backgroundColor: "#F0F0F0"
    },
    row: {
        flex: 1,
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 5,
        marginRight: 5,
        backgroundColor: "white",
        height: 320
    },
    name: {
        padding: 2,
        fontWeight: "bold"
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
        fontSize: 16
    },
    heartIconContainer: {
        flex: 1,
        justifyContent: "flex-end"
    },
    imageBackground: {
        width: 190,
        height: 190,
    }
});

export default HomeScreen;
