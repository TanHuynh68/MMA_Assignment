import { ArtTool, Brand } from "@/models";
import { getAllArtTool, getAllBrandName, updateStatusArtTool } from "@/services";
import { useEffect, useState } from "react";
import { Button, FlatList, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import ButtonCustom from "../ButtonCustom";

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
            <View>
                <ScrollView>
                    <FlatList
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
                                            title={`${item.name} (${countArtToolOfBrand[index] || 0})`}
                                            isSelected={item.id === buttonColorWithBrandId}
                                        />
                                    </View>
                                </>
                            );
                        }}
                    />
                </ScrollView>
            </View>
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
                                    </ImageBackground>
                                </Pressable>
                                <Text style={styles.name}>{item.name}</Text>
                                <View style={{ flex: 1, justifyContent: "space-between" }}>
                                    <Text style={styles.originalPrice}>${item.price}</Text>
                                    <Text style={styles.discountPrice}>${(item.price * item.discount / 100).toFixed(2)}</Text>
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
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    renderList: {
        flexDirection: "row"
    },
    row: {
        flex: 1,
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 15,
        margin: 10,
        backgroundColor: "white"
    },
    name: {
        padding: 2,
        fontWeight: "bold"
    },
    brandRow: {
        flex: 1,
        margin: 10,
    },
    originalPrice: {
        padding: 10,
        textDecorationLine: "line-through"
    },
    discountPrice: {
        padding: 10,
        backgroundColor: "#ffebeb",
        color: "red",
        fontWeight: "bold"
    },
    heartIconContainer: {
        position: "absolute",
        left: 135
    },
    imageBackground: {
        width: 160,
        height: 100,
    }
});

export default HomeScreen;
