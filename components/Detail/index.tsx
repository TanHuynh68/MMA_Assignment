import { Button, FlatList, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Rating } from '@rneui/themed';
import { useEffect, useState } from "react";
import { ArtTool, Feedback } from "@/models";
import Entypo from '@expo/vector-icons/Entypo';
import ButtonCustom from "../ButtonCustom";
import { Avatar } from 'react-native-elements';
const DetailScreen = ({ navigation, route }: any) => {
    const [ratingAverage, setRatingAverage] = useState<number>(0)
    const ratingCompleted = (rating: number) => {
        console.log('Rating is: ' + rating);
    };
    const { item, page } = route.params;
    useEffect(() => {
        getAverageRatingFeedback();
    }, [])
    if (!item) {
        return <Text>No item data available.</Text>;
    }
    const getAverageRatingFeedback = async () => {
        let count = 0
        let index = 0
        const average = item.feedback.map((feedbackItem: Feedback) => {
            count += feedbackItem.rating
            index++
        })
        setRatingAverage(count / index)
    }
    const rating = [5, 4, 3, 2, 1]

    const handleSelectedRating = () => {

    }
    return (
        <View style={styles.view}>
            <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
                <Text numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={{ paddingVertical: 10 }}>{item.brandName}</Text>
                <View style={{ flexDirection: "row", paddingVertical: 10 }}>
                    <Text
                        style={styles.priceAfterDiscount}
                    >${(item.price - item.price * item.discount / 100).toFixed(2)}</Text>
                    <Text
                        style={styles.priceOrigin}
                    >${item.price}</Text>
                </View>
            </View>
            <View style={styles.feedbackContainer}>
                <View>
                    <Text style={{ fontSize: 20 }}>
                        {ratingAverage.toFixed(2)} <Entypo name="star" size={24} color="orange" /> Feedback
                    </Text>
                </View>
                <View >
                    <ScrollView style={{ borderBottomWidth: 1, borderBlockColor: "#ccc", paddingBottom: 10 }}>
                        <FlatList
                            keyExtractor={item => item + ""}
                            horizontal={true}  // Đảm bảo giá trị này là true
                            data={rating}
                            renderItem={
                                ({ item, index }) => {
                                    return (
                                        <>
                                            {index === 0 && (
                                                <View style={styles.buttonContainer}>
                                                    <ButtonCustom
                                                        isSelected={false}
                                                        title="All"
                                                        onPress={handleSelectedRating}
                                                    />
                                                </View>
                                            )}
                                            {index === 0 && (
                                                <View style={styles.buttonContainer}>
                                                    <ButtonCustom
                                                        isSelected={false}
                                                        title="Positive"
                                                        onPress={handleSelectedRating}
                                                    />
                                                </View>
                                            )}
                                            {index === 0 && (
                                                <View style={styles.buttonContainer}>
                                                    <ButtonCustom
                                                        isSelected={false}
                                                        title="Negative"
                                                        onPress={handleSelectedRating}
                                                    />
                                                </View>
                                            )}
                                            <View style={styles.buttonContainer}>
                                                <ButtonCustom
                                                    isSelected={false}
                                                    title={item + ""}
                                                    onPress={handleSelectedRating}
                                                />
                                            </View>
                                        </>
                                    );
                                }
                            }
                        />

                    </ScrollView>
                    <View>
                        <FlatList
                            data={item.feedback}
                            keyExtractor={item => item.id + ""}
                            renderItem={({ item }) => {
                                return (
                                    <>
                                        <View style={styles.userFeedback}>
                                            <View style={{ flexDirection: "row" }}>
                                                <Avatar
                                                    rounded
                                                    source={
                                                        item.avatarUrl.length > 1000 ? { uri: item.avatarUrl } : require("@/assets/images/avatarUser.png")
                                                    }
                                                />
                                                <View
                                                    style={{ flex: 1, justifyContent: "center", paddingLeft: 10 }}
                                                >
                                                    <Text>{item.userName}</Text>
                                                </View>


                                            </View>
                                            <View style={styles.starUserFeedback}>
                                                {
                                                    Array.from({ length: item.rating }, (_, index) => (
                                                        <Entypo key={index} name="star" size={24} color="orange" />
                                                    ))
                                                }
                                            </View>
                                            <View >
                                                <Text style={styles.desUserFeedback}>
                                                    {item.description}
                                                </Text>
                                            </View>
                                        </View>
                                    </>
                                )
                            }}
                        />

                    </View>
                </View>
            </View>

            {/* <Button title="Go back" onPress={() => navigation.navigate(page === "favorite" ? "Favortite-List" : "Home")} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    userFeedback: {
        flex: 1, 
        marginTop: 15
    },
    desUserFeedback:{
        flex:1,
        fontSize: 18
    },
    starUserFeedback: {
        paddingVertical: 10,
        flexDirection: 'row'
    },
    buttonContainer: {
        flex: 1,
        margin: 5
    },
    ratingFilterContainer: {
        borderRadius: 20,
        borderTopColor: "#ccc",
        borderWidth: 1,
        flex: 1
    },
    feedbackContainer: {
        flex: 1,
    },
    priceAfterDiscount: {
        fontSize: 28,
        color: "red",
        paddingRight: 10
    },
    priceOrigin: {
        textDecorationLine: "line-through",
        color: "#ccc",
        paddingTop: 10,
        fontSize: 18
    },
    image: {
        flex: 1,
        padding: 5,
        width: 360,
        height: 300,

    },
    view: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: "white"
    }
})
export default DetailScreen;
