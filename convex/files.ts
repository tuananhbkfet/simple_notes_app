import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Tạo một URL tạm thời để client có thể tải file lên
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Lấy URL công khai của file đã được lưu trữ từ storageId
export const getUrlFromStorageId = mutation({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});
