import { FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { getAllKeyWordsOfHistory, newKeyword } from "@/services/search.service";
import { SearchHistory } from "@/models";
import LoadingComponent from "../loading";

const SearchScreen = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [history, setHistory] = useState<SearchHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showHistory, setShowHistory] =  useState<boolean>(false);
    useEffect(() => {
        getAllHistoryFromSearchScreen();
    }, []);

    // Hàm lấy tất cả lịch sử tìm kiếm
    const getAllHistoryFromSearchScreen = async () => {
        setLoading(true);
        const res = await getAllKeyWordsOfHistory();
        if (res) {
            setHistory(res);
        }
        setLoading(false);
    };

    // Hiển thị màn hình loading nếu đang tải
    if (loading) {
        return <LoadingComponent />;
    }

    // Xử lý khi xóa từ khóa tìm kiếm
    const handleDeleteInputSearch = () => {
        setSearchInput('');
        getAllHistoryFromSearchScreen();  // Cập nhật lại lịch sử sau khi xóa
    };

    // Xử lý khi nhập từ khóa tìm kiếm
    const handleSetInput = async (keyword: string) => {
        setSearchInput(keyword);
        const findHistoryByKeyword = await getAllKeyWordsOfHistory(keyword);
        setHistory(findHistoryByKeyword);
    };

    // Xử lý khi submit từ khóa tìm kiếm
    const handleSubmitKeyword = async (event: any) => {
        const keyword = event.nativeEvent.text;
        console.log('Bạn đã tìm kiếm:', keyword);

        const findKeyword = await getAllKeyWordsOfHistory(keyword);
        if (findKeyword.length === 0) {
            const res = await newKeyword(keyword, 0);
            console.log("Từ khóa mới đã được thêm:", res);
        }
    };

    return (
        <View>
            {/* Input tìm kiếm */}
            <View style={styles.containerSearch}>
                <TextInput
                    autoCapitalize="none"
                    onChangeText={handleSetInput}
                    value={searchInput}
                    style={styles.textInput}
                    placeholder="Search"
                    autoFocus={true}
                    onBlur={() => Keyboard.dismiss()}
                    onSubmitEditing={handleSubmitKeyword}  // Không cần truyền target
                />

                {/* Hiển thị nút xóa nếu input không rỗng */}
                {searchInput !== '' && (
                    <Pressable style={styles.iconContainer} onPress={handleDeleteInputSearch}>
                        <FontAwesome6 name="x" size={16} color="black" />
                    </Pressable>
                )}
            </View>

            {/* Danh sách lịch sử tìm kiếm */}
            <FlatList
                data={history}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <Pressable onPress={() => handleSetInput(item.keyword)}>
                        <View style={styles.containerSearchKeyWord}>
                            <Text style={styles.text}>{item.keyword}</Text>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    containerSearchKeyWord: {
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 10,
    },
    text: {
        paddingVertical: 5,
    },
    containerSearch: {
        borderRadius: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        marginHorizontal: 10,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        position: "relative",
    },
    textInput: {
        flex: 1,
        paddingVertical: 10,
        paddingRight: 35,
    },
    iconContainer: {
        position: "absolute",
        right: 15,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
});
