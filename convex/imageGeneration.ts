import { v } from "convex/values";
import { action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { nanoid } from "nanoid";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Action để tạo hình ảnh từ prompt
export const generateImage = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    // Kiểm tra xác thực người dùng
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to generate images");
    }
    
    // Kiểm tra API key
    if (!OPENROUTER_API_KEY) {
      throw new Error("Missing OpenRouter API key");
    }
    
    // Tạo prompt nâng cao để cải thiện kết quả
    const enhancedPrompt = `High quality, detailed illustration of: ${args.prompt}`;
    
    try {
      // Gọi API OpenRouter với mô hình google/gemini-2.5-flash-image-preview
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://your-app-domain.com", // Thay thế bằng domain thực của bạn
          "X-Title": "Notes App" // Tên ứng dụng của bạn
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            { role: "user", content: enhancedPrompt }
          ],
          modalities: ["image", "text"]
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenRouter API error:", errorData);
        throw new Error(`Image generation failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Bắt đầu logic xử lý phản hồi mới
      console.log("OpenRouter API response:", JSON.stringify(data, null, 2));

      const message = data?.choices?.[0]?.message;

      if (!message) {
        throw new Error("Invalid response structure from OpenRouter API");
      }

      // Ưu tiên kiểm tra hình ảnh trong trường 'images'
      const imageUrl = message.images?.[0]?.image_url?.url;
      if (imageUrl && imageUrl.startsWith("data:image")) {
        return imageUrl;
      }

      // Kiểm tra dự phòng nếu nội dung là một data URL
      if (message.content && message.content.startsWith("data:image")) {
        return message.content;
      }

      // Nếu không có hình ảnh hợp lệ, báo lỗi
      console.error("API returned text instead of an image:", message.content);
      throw new Error(`API không trả về hình ảnh. Phản hồi: ${message.content}`);
    } catch (error: any) {
      console.error("Error generating image:", error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  },
});