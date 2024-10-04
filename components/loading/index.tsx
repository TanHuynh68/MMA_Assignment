import { StyleSheet, Text, View } from "react-native";

const LoadingComponent =()=>{
    return(
        <View>
            <Text style={styles.loadingContainer}>Loading ...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
})
export default LoadingComponent;