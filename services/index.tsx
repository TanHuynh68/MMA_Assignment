import axiosInstance from "@/api/axiosIntance"
import BrandData from "@/data/brand"

export const getAllArtTool = async() => {
    try {
        const res = await axiosInstance.get('/Art')
        if (res) {
            return res
        }
        return []
    } catch (error) {
        return console.log("error: ", error);
    }
}

export const getAllBrandName = () => {
    try {
        const res =  BrandData
        if (res) {
            return res
        }
        return []
    } catch (error) {
        return console.log("getAllBrandName: ", error);
    }
}

export const updateStatusArtTool = async (id: string, statusArtTool: boolean) => {
    try {
        const res = await axiosInstance.put(`/Art/${id}`, {
            status: statusArtTool
        });
        return res; // Trả về dữ liệu nhận được từ API
    } catch (error) {
        console.error("updateStatusArtTool: ", error);
        throw error; // Ném lỗi để xử lý ở nơi khác
    }
};
