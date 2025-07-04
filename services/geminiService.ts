import { GoogleGenAI } from "@google/genai";
import { AiFurnitureSuggestion } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY môi trường biến chưa được thiết lập. Các tính năng AI sẽ không hoạt động.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || " " });

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

export const getFurnitureSuggestions = async (prompt: string): Promise<AiFurnitureSuggestion | null> => {
    if (!process.env.API_KEY) {
        alert("Vui lòng thiết lập API_KEY để sử dụng tính năng AI.");
        return null;
    }

    try {
        const fullPrompt = `
            Dựa trên mô tả sản phẩm nội thất gỗ công nghiệp sau, hãy cung cấp một đối tượng JSON với các gợi ý về vật liệu, kích thước và phụ kiện.
            Mô tả: "${prompt}"

            Chỉ trả về một đối tượng JSON hợp lệ, không có văn bản giải thích nào khác. Kích thước tính bằng milimét (mm).
            Sử dụng cấu trúc JSON sau:
            {
              "productName": "Tên sản phẩm (ví dụ: Tủ bếp dưới)",
              "material": "Loại ván (ví dụ: MDF chống ẩm)",
              "finish": "Loại bề mặt (ví dụ: Phủ Melamine)",
              "dimensions": {
                "length": 1200,
                "width": 600,
                "height": 800
              },
              "hardware": [
                { "name": "Bản lề", "quantity": 4 },
                { "name": "Ray trượt", "quantity": 2 }
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

        const text = response.text;
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