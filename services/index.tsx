import axiosInstance from "@/api/axiosIntance"


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

export const getAllBrandName = async() => {
    try {
        const res = await axiosInstance.get('/brand')
        console.log("getAllBrandName", res)
        if (res) {
            return res
        }
        return []
    } catch (error) {
        return console.log("getAllBrandName: ", error);
    }
}