import React, { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface ImageGeneratorProps {
  onImageGenerated: (imageUrl: string, prompt: string) => void;
}

export function ImageGenerator({ onImageGenerated }: ImageGeneratorProps) {
  const [imagePrompt, setImagePrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const generateImage = useAction(api.imageGeneration.generateImage);
  
  const handleGenerateImage = async () => {
    if (imagePrompt.trim() === "") {
      toast.error("Vui lòng nhập mô tả hình ảnh");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const imageUrl = await generateImage({ prompt: imagePrompt });
      setGeneratedImage(imageUrl);
      onImageGenerated(imageUrl, imagePrompt);
      toast.success("Đã tạo hình ảnh thành công");
    } catch (error: any) {
      toast.error(`Không thể tạo hình ảnh: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleClearImage = () => {
    setGeneratedImage(null);
    setImagePrompt("");
    onImageGenerated("", "");
  };
  
  return (
    <div className="w-full space-y-4 py-4 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium">Tạo hình ảnh cho ghi chú</h3>
      
      <div className="space-y-2">
        <textarea
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          placeholder="Mô tả hình ảnh bạn muốn tạo..."
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          disabled={isGenerating}
        />
        
        <div className="flex gap-2">
          <button
            onClick={handleGenerateImage}
            disabled={isGenerating || !imagePrompt.trim()}
            className={`px-4 py-2 rounded ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            {isGenerating ? "Đang tạo..." : "Tạo hình ảnh"}
          </button>
          
          {generatedImage && (
            <button
              onClick={handleClearImage}
              className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
            >
              Xóa hình ảnh
            </button>
          )}
        </div>
      </div>
      
      {generatedImage && (
        <div className="mt-4">
          <img 
            src={generatedImage} 
            alt="Generated from prompt" 
            className="w-full max-h-60 object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
}
