import { Button, Image, StyleSheet, Text, View } from "react-native";
import { Rating } from '@rneui/themed';
import { useEffect } from "react";
const DetailScreen = ({ navigation, route }: any) => {
    const ratingCompleted = (rating: number) => {
        console.log('Rating is: ' + rating);
    };
    const { item, page } = route.params;
    useEffect(()=>{
        console.log("Item data: ", item);
    },[item])
    if (!item) {
        return <Text>No item data available.</Text>;
    }
    return (
        <View style={styles.view}>
            <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={{ flex: 1 }}>
                {item.name} {/* Sử dụng dấu {} để hiển thị giá trị biến */}
            </Text>
            <Rating
            
                showRating
                imageSize={40}
                onFinishRating={ratingCompleted}
                style={{ paddingVertical: 10,  flex: 1  }}
            />
             <Button title="Go back" onPress={() => navigation.navigate(page === "favorite" ? "Favortite-List" : "Home")} />
        </View>
    );
}

const styles = StyleSheet.create({
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
