import { ArtTool, Brand } from "@/models";
import { getAllArtTool, getAllBrandName, updateStatusArtTool } from "@/services";
import { useEffect, useState } from "react";
import { Button, FlatList, Image, Pressable, StyleSheet, Text, View, } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { CheckBox } from '@rneui/themed';
import { useNavigation } from "@react-navigation/native";
const FavoritesListScreen = () => {
    const navigation: any = useNavigation();
    const [artTool, setArtTool] = useState<ArtTool[]>([]);
    // const [brand, setBrand] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkBox, setCheckBox] = useState<boolean>(false);
    const [artToolChecked, setArtToolChecked] = useState<string[]>([]);
    useEffect(() => {
        getAllArtToolFromHome();
        // getAllBrandNameFromHome();
    }, [])

    const handleCheckBox = (id: string) => {
        console.log("clicked")
        console.log("artToolChecked: ", artToolChecked)
        if (artToolChecked.includes(id)) {
            setArtToolChecked(artToolChecked.filter(item => item != id))
            setCheckBox(false)
        } else {
            setArtToolChecked([...artToolChecked, id]);
        }
    }

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
    const handleCheckAll = () => {
        console.log("checkbox: ", checkBox)
        if (checkBox === false) {
            setCheckBox(true)
            setArtToolChecked(artTool.map((item) => item.id))
        } else {
            setCheckBox(false)
            setArtToolChecked([])
        }
        console.log("artToolChecked: ", artToolChecked)
    }
    const renderDeleteText = () => {
        if (checkBox === true || artToolChecked.length === artTool.length) {
            return "Delete all item"
        }
        else {
            return "Delete " + artToolChecked.length + " item"
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.titleScreen}>
                Favorites List
            </Text>
            <View style={{ paddingBottom: 120 }}>
                <FlatList
                    data={artTool}
                    keyExtractor={(item) => item.id + ""}
                    renderItem={({ item, index }) => {
                        return (
                            <View >
                                <View style={styles.row}>
                                    <CheckBox
                                        onPress={() => handleCheckBox(item.id)}
                                        checked={artToolChecked.includes(item.id) ? true : false} size={24} />
                                    <Pressable
                                        onPress={() => navigation.navigate('Detail', { item: item, page: "favorite" })}
                                    >
                                        <Image
                                            resizeMode="cover"
                                            style={{ width: 160, height: 100 }}
                                            source={{ uri: item.image }}
                                        ></Image>
                                    </Pressable>

                                    <View style={{ flex: 1, paddingLeft: 10, paddingBottom: 30 }}>
                                        <Text numberOfLines={1}>{item?.name}</Text>
                                        <Text>{item?.brandName}</Text>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text
                                             style={{paddingRight: 10, fontSize: 20, color: "red"}}
                                             >${(item.price - item?.discount * item?.price / 100).toFixed(2)}</Text>
                                            <Text
                                            style={{paddingTop: 5, textDecorationLine: "line-through"}}
                                            >${item?.price}</Text>
                                        </View>
                                    </View>

                                </View>
                            </View>
                        )
                    }}
                >
                </FlatList>
            </View>
            <View style={styles.footer}>
                <View style={{ flex: 1 }}>
                    <CheckBox
                        onPress={handleCheckAll}
                        checked={checkBox} size={24} />
                    <Text style={{ paddingBottom: 5, flex: 1 }}>(Select all)</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {
                        artToolChecked.length >= 1 &&
                        <Button title={renderDeleteText()}>
                        </Button>
                    }
                </View>
                <View style={{ flex: 3 }}></View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        backgroundColor: "white",
        width: "110%",
        height: 100,
        justifyContent: "center",
        borderWidth: 2,
        borderTopColor: "#ccc",
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 5
    },
    container: {
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
    trashIcon: {
        paddingRight: 10,
    },
    titleScreen: {
        fontWeight: "bold"
    }
})
export default FavoritesListScreen;