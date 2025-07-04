import { GoogleGenAI } from "@google/genai";
import { AiFurnitureSuggestion, FurnitureMaterials } from '../types';

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
    console.warn("Biến môi trường VITE_API_KEY chưa được thiết lập. Các tính năng AI sẽ không hoạt động.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const parseJsonResponse = <T,>(text: string): T | null => {
    let jsonStr = text.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
        jsonStr = match[1].trim();
    }

    try {
        return JSON.parse(jsonStr) as T;
    } catch (e) {
        console.error("Lỗi phân tích cú pháp JSON:", e, "Chuỗi gốc:", jsonStr);
        return null;
    }
};

export const getFurnitureSuggestions = async (prompt: string, materials: FurnitureMaterials): Promise<AiFurnitureSuggestion | null> => {
    if (!apiKey) {
        alert("Vui lòng thiết lập biến môi trường VITE_API_KEY trong cài đặt dự án trên Vercel để sử dụng tính năng AI.");
        return null;
    }
    
    // Tạo chuỗi danh sách các vật tư có sẵn
    const availableMaterials = materials.materials.map(m => m.name).join(', ');
    const availableFinishes = materials.finishes.map(f => f.name).join(', ');
    const availableHardware = materials.hardware.map(h => h.name).join(', ');

    try {
        const fullPrompt = `
            Dựa trên mô tả sản phẩm nội thất gỗ công nghiệp sau, hãy cung cấp một đối tượng JSON với các gợi ý về vật liệu, kích thước và phụ kiện.
            Mô tả: "${prompt}"

            Hãy chọn vật liệu từ danh sách CÓ SẴN sau đây:
            - Vật liệu ván (material): ${availableMaterials}
            - Bề mặt hoàn thiện (finish): ${availableFinishes}
            - Phụ kiện (hardware): ${availableHardware}

            Chỉ trả về một đối tượng JSON hợp lệ, không có văn bản giải thích nào khác. Kích thước tính bằng milimét (mm).
            Sử dụng cấu trúc JSON sau:
            {
              "productName": "Tên sản phẩm (ví dụ: Tủ bếp dưới)",
              "material": "Một giá trị từ danh sách vật liệu ván",
              "finish": "Một giá trị từ danh sách bề mặt hoàn thiện",
              "dimensions": {
                "length": 1200,
                "width": 600,
                "height": 800
              },
              "hardware": [
                { "name": "Một giá trị từ danh sách phụ kiện", "quantity": 4 },
                { "name": "Một giá trị khác từ danh sách phụ kiện", "quantity": 2 }
              ]
            }
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.2,
            }
        });

        const text = response.text || '';
        return parseJsonResponse<AiFurnitureSuggestion>(text);

    } catch (error) {
        console.error("Lỗi khi gọi Gemini API:", error);
        alert("Đã xảy ra lỗi khi nhận gợi ý từ AI. Vui lòng thử lại.");
        return null;
    }
};

export const getSignageSuggestions = async (prompt: string): Promise<any | null> => {
    // Tương tự, có thể triển khai cho bảng hiệu
    console.log("Hàm gợi ý cho bảng hiệu chưa được triển khai:", prompt);
    return Promise.resolve(null);
};