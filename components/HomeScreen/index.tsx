import { ArtTool, Brand } from "@/models";
import { getAllArtTool, getAllBrandName, updateStatusArtTool } from "@/services";
import { useEffect, useState } from "react";
import { Button, FlatList, Image, StyleSheet, Text, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
const HomeScreen = () => {
    const [artTool, setArtTool] = useState<ArtTool[]>([])
    const [brand, setBrand] = useState<Brand[]>([])
    useEffect(() => {
        getAllArtToolFromHome();
        getAllBrandNameFromHome();
    }, [])

    const getAllArtToolFromHome = async () => {
        const res = await getAllArtTool();
        if (res) {
            setArtTool(res)
        }
    }

    const getAllBrandNameFromHome = async () => {
        const res = await getAllBrandName();
        if (res) {
            setBrand(res);
        }
    }

    const setStatus = async (id: string) => {
        console.log("pressed");
        const currentItem = artTool.find(item => item.id === id);
        if (currentItem) {
            const newStatus = !currentItem.status;
            try {
                const updatedItem = await updateStatusArtTool(id, newStatus);
                setArtTool(artTool.filter(item => item.id === id ? { ...item, status: updatedItem.status } : item));
            } catch (error) {
                console.error("Error updating status: ", error);
            }
        }
    };

    return (
        <View>
            <View>
                <FlatList
                    numColumns={3}
                    data={brand}
                    keyExtractor={item => item.id + ""}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.brandRow}>
                                <Button  title={item.name}></Button>
                            </View>
                        )
                    }}
                >
                </FlatList>
            </View>
            <View style={styles.renderList}>
                <FlatList
                    numColumns={2}
                    data={artTool}
                    keyExtractor={item => item.id + ""}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.row}>
                                <Text style={styles.name}>
                                    Name: {item.name}
                                </Text>
                                <Image
                                    resizeMode="cover"
                                    style={{ width: 160, height: 100 }}
                                    source={{ uri: item?.image }}
                                />
                                <View style={{ flex: 1, justifyContent: "space-between" }}>
                                    <Text>
                                        {item.price * item.discount / 100}$ {item.price} {item.discount} %
                                        <View>
                                            {
                                                item.status === true ?
                                                    <AntDesign onPress={()=>setStatus(item.id)} name="heart" size={24} color="black" />
                                                    :
                                                    <AntDesign onPress={()=>setStatus(item.id)} name="hearto" size={24} color="black" />
                                            }
                                        </View>
                                    </Text>
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    renderList: {
        flexDirection: "row"
    },
    row: {
        flex: 1,
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 15,
        margin: 10
    },
    name: {
        padding: 2
    },
    brandRow: {
        flex: 1,
        borderColor: "#ccc",
        borderWidth: 1,
        margin: 10,
    },
})
export default HomeScreen;