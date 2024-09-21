export interface ArtTool {
    id: string;         // ID của công cụ nghệ thuật
    name: string;       // Tên của công cụ nghệ thuật
    price: number;      // Giá của công cụ nghệ thuật
    discount: number;   // Giá trị giảm giá
    image: string;      // Đường dẫn hình ảnh của công cụ
    status: boolean;    // Trạng thái (có thể là trạng thái còn hàng hoặc yêu thích)
    brandName: string;  // Tên thương hiệu của công cụ nghệ thuật
    brandId: string;    // ID của thương hiệu
  }

export interface Brand{
  id: string,
  name: string,
  artToolId: string
}