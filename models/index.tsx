export interface ArtTool {
  id: string;
  name: string;
  price: number;
  discount: number;
  image: string;
  status: boolean;
  brandName: string;
  brandId: string;
  history: string[];  // Mảng từ khoá lịch sử
  feedback: Feedback[];  // Mảng phản hồi
}

export interface Feedback {
  id: string;
  userName: string;
  description: string;
  image: Image[];  // Mảng hình ảnh của phản hồi
  rating: number;
  avatarUrl: string;
}

export interface Image {
  url: string;  // Đường dẫn hình ảnh
}

export interface Brand{
  id: string,
  name: string,
  artToolId: string
}

export interface SearchHistory {
  id: number,
  keyword: string,
  searchCount: number
}