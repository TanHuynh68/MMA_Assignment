import { ArtTool, Brand } from "@/models";
import { getAllArtTool, getAllBrandName, updateStatusArtTool } from "@/services";
import { useEffect, useState } from "react";
import { Button, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
const HomeScreen = ({ }) => {
    const navigation: any = useNavigation();
    const [artTool, setArtTool] = useState<ArtTool[]>([]);
    const [brand, setBrand] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [buttonColor, setButtonColor] = useState<string>('blue')
    const [buttonSelected, setButtonSelected] = useState<boolean>(false);
    useEffect(() => {
        getAllArtToolFromHome();
        getAllBrandNameFromHome();
    }, [])

    const getAllArtToolFromHome = async () => {
        setLoading(true)
        const res= await getAllArtTool();
        if (res) {
            setArtTool(res)
        }
        setLoading(false)
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
                getAllArtToolFromHome();
            } catch (error) {
                console.error("Error updating status: ", error);
            }
        }
    };

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

    const filterBrand = async (brandId: string) =>{
        setLoading(true)
        const res = await getAllArtTool();
        setArtTool(res.filter((item:ArtTool)=>item.brandId === brandId))
        setLoading(false)
    }
    return (
        <View>
            <View>
                <Button color={"red"} onPress={()=> getAllArtToolFromHome()} title="All"></Button>
                <ScrollView >
                    <FlatList
                        horizontal={true}
                        data={brand}
                        keyExtractor={item => item.id + ""}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.brandRow}>
                                    <Button
                                    onPress={()=>filterBrand(item.id)}
                                    title={item.name}></Button>
                                </View>
                            )
                        }}
                    >
                    </FlatList>
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
                                    <Image
                                        resizeMode="cover"
                                        style={{ width: 160, height: 100 }}
                                        source={{ uri: item?.image }}
                                    />
                                </Pressable>
                                <Text style={styles.name}>
                                    {item.name}
                                </Text>
                                <View style={{ flex: 1, justifyContent: "space-between" }}>
                                    <Text>
                                        {item.price * item.discount / 100}$ {item.price} {item.discount} %
                                        <View>
                                            {
                                                item.status === true ?
                                                    <AntDesign onPress={() => setStatus(item.id)} name="heart" size={24} color="black" />
                                                    :
                                                    <AntDesign onPress={() => setStatus(item.id)} name="hearto" size={24} color="black" />
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
        margin: 10,
        backgroundColor: "white"
    },
    name: {
        padding: 2,
        fontWeight: "bold"
    },
    brandRow: {
        flex: 1,
        borderColor: "#ccc",
        borderWidth: 1,
        margin: 10,
    },
})
export default HomeScreen;