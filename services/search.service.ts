import axiosInstance from "@/api/axiosIntance"
import { SearchHistory } from "@/models"

export const getAllKeyWordsOfHistory = async (keyword?: string) => {
    try {
        const response = await axiosInstance.get('/history')
        if (response) {
            const filterBySearchCount = response.sort((a: SearchHistory, b: SearchHistory) => b.searchCount - a.searchCount)
            if (keyword) {
                const filterByKeyword = filterBySearchCount.filter((item: SearchHistory) => item.keyword.includes(keyword))
                return filterByKeyword.slice(0, 10)
            }
            return filterBySearchCount.slice(0, 10)
        }
    } catch (error) {
        console.log('getAllKeyWordsOfHistory-error: ', error)
        return []
    }
}

export const getHistoryDetail = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/history/${id}`)
        if (response) {
            return response
        }
    } catch (error) {
        console.log('getHistoryDetail-error: ', error)
        return []
    }
}

export const newKeyword = async (text: any, searchCount: number) => {
    try {
        const response = await axiosInstance.post(`/history`, {
            searchCount: searchCount,
            keyword: text
        })
        if (response) {
            return response
        }
    } catch (error) {
        console.log('newKeyword-error: ', error)
        return []
    }
}

