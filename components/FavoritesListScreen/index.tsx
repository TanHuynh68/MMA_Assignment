import { ArtTool, Brand } from "@/models";
import { getAllArtTool, getAllBrandName, updateStatusArtTool } from "@/services";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
const FavoritesListScreen = () => {
    const navigation:any = useNavigation();
    const [artTool, setArtTool] = useState<ArtTool[]>([]);
    // const [brand, setBrand] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllArtToolFromHome();
        // getAllBrandNameFromHome();
    }, [])

    const getAllArtToolFromHome = async () => {
        setLoading(true)
        const res = await getAllArtTool();
        if (res) {
            setArtTool(res.filter((item: ArtTool) => item.status === true))
        }
        setLoading(false)
    }

    if (loading) {
        return (
            <View style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1
            }}>
                <Text>Loading ...</Text>
            </View>
        )
    }

    // const getAllBrandNameFromHome = async () => {
    //     const res = await getAllBrandName();
    //     if (res) {
    //         setBrand(res);
    //     }
    // }

    const setStatus = async (id: string) => {
        console.log("pressed");
        const currentItem = artTool.find(item => item.id === id);
        if (currentItem) {
            const newStatus = !currentItem.status;
            try {
                const updatedItem = await updateStatusArtTool(id, newStatus);
                setArtTool(artTool.filter(item => item.id === id ? { ...item, status: updatedItem.status } : item));
                getAllArtToolFromHome();
            } catch (error) {
                console.error("Error updating status: ", error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleScreen}>
                Favorites List
            </Text>
            <View>
                <FlatList
                    data={artTool}
                    keyExtractor={(item) => item.id + ""}
                    renderItem={({ item }) => {
                        return (
                            <View >
                                <View style={styles.row}>
                                    <Pressable
                                           onPress={()=>navigation.navigate('Detail', {item: item, page: "favorite"})}
                                    >
                                        <Image
                                            resizeMode="cover"
                                            style={{ width: 160, height: 100 }}
                                            source={{ uri: item.image }}
                                        ></Image>
                                    </Pressable>
                                    <View>
                                        <Text>{item?.name}</Text>
                                        <Text>{item?.price}$</Text>
                                        <Text>{item?.discount}%</Text>
                                        <Text>{item?.discount * item?.price / 100}%</Text>
                                    </View>
                                    <Feather onPress={() => setStatus(item.id)} style={styles.trashIcon} name="trash-2" size={24} color="black" />
                                </View>
                            </View>
                        )
                    }}
                >
                </FlatList>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        backgroundColor: "white"
    },
    trashIcon: {
        paddingRight: 10,
    },
    titleScreen: {
        fontWeight: "bold"
    }
})
export default FavoritesListScreen;