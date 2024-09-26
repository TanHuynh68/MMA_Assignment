import { Button, Pressable, StyleSheet, Text, View } from "react-native";

interface ButtonCustomProps {
    isSelected: boolean,
    title: string,
    onPress: () => void;
}
const ButtonCustom = ({ isSelected, title, onPress }: ButtonCustomProps) => {
    return (
        <Pressable
            style={[styles.button, { backgroundColor: isSelected ? "yellow" : "#ccc" }]}
            onPress={onPress}
        >
            <Text>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
   button: {
        paddingVertical: 10, // Khoảng cách trên dưới
        paddingHorizontal: 20, // Khoảng cách trái phải
        borderRadius: 20, // Bo tròn 4 góc, có thể tăng lên nếu muốn bo tròn nhiều hơn
        alignItems: 'center', // Canh giữa theo chiều ngang
        justifyContent: 'center', // Canh giữa theo chiều dọc
    },
})

export default ButtonCustom;