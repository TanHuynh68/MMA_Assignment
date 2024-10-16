import { Button, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Rating } from '@rneui/themed';
import { useEffect, useState } from "react";
import { ArtTool, Feedback } from "@/models";
import Entypo from '@expo/vector-icons/Entypo';
import ButtonCustom from "../ButtonCustom";
import { Avatar } from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

const DetailScreen = ({ navigation, route }: any) => {
    const [buttonColorWithIndex, setButtonColorWithIndex] = useState<string>('');
    const [ratingAverage, setRatingAverage] = useState<number>(0);
    const [dataFeedback, setDataFeedback] = useState<Feedback[]>([]);
    const [favorites, setFavorites] = useState<ArtTool[]>([]);
    const ratingCompleted = (rating: number) => {
        console.log('Rating is: ' + rating);
    };

    const { item, page } = route.params;

    useEffect(() => {
        getAverageRatingFeedback();
        setDataFeedback(item.feedback);
        loadFavoritesFromStorage()
    }, []);



    if (!item) {
        return <Text>No item data available.</Text>;
    }

    const getAverageRatingFeedback = async () => {
        let count = 0;
        let index = 0;
        const average = item.feedback.map((feedbackItem: Feedback) => {
            count += feedbackItem.rating;
            index++;
        });
        setRatingAverage(count / index);
    };

    const rating = [5, 4, 3, 2, 1];

    const handleSelectedRating = (rating: string) => {
        if (rating !== "All" && rating !== "Positive" && rating !== "Negative") {
            setDataFeedback(item.feedback.filter((item: Feedback) => item.rating === parseInt(rating)));
            setButtonColorWithIndex(rating);
        } else {
            if (rating === "All") {
                setDataFeedback(item.feedback);
            } else if (rating === "Positive") {
                setDataFeedback(item.feedback.filter((item: Feedback) => item.rating === 4 || item.rating === 5));
            } else if (rating === "Negative") {
                setDataFeedback(item.feedback.filter((item: Feedback) => item.rating === 1 || item.rating === 2));
            }
            setButtonColorWithIndex(rating);
        }
    };

    useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: "none"
            }
        });
        return () => navigation.getParent()?.setOptions({
            tabBarStyle: undefined
        });
    }, [navigation]);

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
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.breadcrumb}>
                <View style={{ flexDirection: "row" }}>
                    {
                        page === "home" ? <Text style={{ color: "#3498db" }} onPress={() => navigation.navigate('Home')}
                        >
                            Home
                        </Text>
                            :
                            <Text
                                style={{ color: "#3498db" }}
                                onPress={() => navigation.navigate('Favorite-List')}
                            >Favorite</Text>
                    }
                    <Text> / Detail</Text>
                </View>
            </View>
            <View style={styles.view}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View >
                    <Text style={{ fontSize: 18, paddingTop: 10 }} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={{ paddingVertical: 10 }}>{item.brandName}</Text>
                    <View>
                        <Text>
                            {item.description}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", paddingVertical: 10 }}>
                        <Text style={styles.priceAfterDiscount}>
                            ${(item.price - item.price * item.discount / 100).toFixed(2)}
                        </Text>
                        <Text style={styles.priceOrigin}>${item.price}</Text>
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
                <View style={styles.feedbackContainer}>
                    <View>
                        <Text style={{ fontSize: 20 }}>
                            {ratingAverage.toFixed(2)} <Entypo name="star" size={24} color="orange" /> Feedback
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {/* <ScrollView
                            style={{ borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 10 }}
                        > */}
                        <FlatList
                            keyExtractor={item => item + ""}
                            horizontal={true}
                            data={rating}

                            renderItem={({ item, index }) => {
                                return (
                                    <>
                                        {index === 0 && (
                                            <>
                                                <View style={styles.buttonContainer}>
                                                    <ButtonCustom
                                                        isSelected={buttonColorWithIndex === "All"}
                                                        title="All"
                                                        onPress={() => handleSelectedRating("All")}
                                                    />
                                                </View>
                                                <View style={styles.buttonContainer}>
                                                    <ButtonCustom
                                                        isSelected={buttonColorWithIndex === "Positive"}
                                                        title="Positive"
                                                        onPress={() => handleSelectedRating("Positive")}
                                                    />
                                                </View>
                                                <View style={styles.buttonContainer}>
                                                    <ButtonCustom
                                                        isSelected={buttonColorWithIndex === "Negative"}
                                                        title="Negative"
                                                        onPress={() => handleSelectedRating("Negative")}
                                                    />
                                                </View>
                                            </>
                                        )}
                                        <View style={styles.buttonContainer}>
                                            <ButtonCustom
                                                isSelected={buttonColorWithIndex === item.toString()}
                                                title={item.toString()}
                                                onPress={() => handleSelectedRating(item.toString())}
                                            />
                                        </View>
                                    </>
                                );
                            }}
                        />
                        {/* </ScrollView> */}
                    </View>
                    <View style={{ flex: 1 }}>
                        {dataFeedback.length > 0 ? (
                            <FlatList
                                scrollEnabled={false}
                                data={dataFeedback}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={dataFeedback.length < 2 ? { paddingBottom: 120 } : styles.userFeedback}>
                                        <View style={{ flexDirection: "row" }}>
                                            <Avatar
                                                rounded
                                                source={
                                                    item.avatarUrl.length > 1000
                                                        ? { uri: item.avatarUrl }
                                                        : require("@/assets/images/avatarUser.png")
                                                }
                                            />
                                            <View style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}>
                                                <Text>{item.userName}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.starUserFeedback}>
                                            {Array.from({ length: item.rating }, (_, index) => (
                                                <Entypo key={index} name="star" size={24} color="orange" />
                                            ))}
                                        </View>
                                        <Text style={styles.desUserFeedback}>
                                            {item.description}
                                        </Text>
                                    </View>
                                )}
                            />
                        ) : (
                            <View style={styles.noDataContainer}>
                                <Text style={styles.noDataText}>No data</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    discountPercentComponent: {
        padding: 0,
        paddingLeft: 10,
        paddingTop: 10,
        fontWeight: "bold",
        alignItems: "center",
        justifyContent: "center"
    },
    discountPercent: {
        color: "red",
        fontSize: 12,
    },
    breadcrumb: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        backgroundColor: "white"
    },
    userFeedback: {
        flex: 1,
        marginTop: 15,
    },
    desUserFeedback: {
        flex: 1,
        fontSize: 18,
    },
    starUserFeedback: {
        paddingVertical: 10,
        flexDirection: 'row',
    },
    buttonContainer: {
        flex: 1,
        margin: 5,
    },
    ratingFilterContainer: {
        borderRadius: 20,
        borderTopColor: "#ccc",
        borderWidth: 1,
        flex: 1,
    },
    feedbackContainer: {

    },
    priceAfterDiscount: {
        fontSize: 28,
        color: "red",
        paddingRight: 10,
    },
    priceOrigin: {
        textDecorationLine: "line-through",
        color: "#ccc",
        paddingTop: 10,
        fontSize: 18,
    },
    image: {
        flex: 1,
        padding: 5,
        width: 360,
        height: 300,
    },
    view: {

        paddingHorizontal: 25,
        backgroundColor: "white",
    },
    noDataContainer: {
        paddingVertical: 120,
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    },
    noDataText: {
        fontSize: 18,
        color: "#888",
    },
});

export default DetailScreen;
