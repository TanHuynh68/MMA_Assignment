import { Button, Pressable, StyleSheet, Text, View } from "react-native";

interface ButtonCustomProps {
    isSelected: boolean,
    title: string,
    onPress: () => void;
}
const ButtonCustom = ({ isSelected, title, onPress }: ButtonCustomProps) => {
    return (
        <Pressable
            style={[styles.button,
            {
                backgroundColor: isSelected ? "white" : "#E8E8E8",
                borderWidth: 1, borderColor: isSelected ? "red" : "#E8E8E8"
            }]}
            onPress={onPress}
        >
            <Text style={{ color: isSelected ? "red" : "black" }}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default ButtonCustom;