import { uploadMediaFile } from "../services/apiServices";

export const uploadMedia = async (file, onProgress) => {
    const formData = new FormData();
    formData.append("upload", file);
  
    try {
      const response = await uploadMediaFile(formData, onProgress);
      const uploadedFile = response?.files?.[0] || response?.data?.files?.[0];
      if (!uploadedFile?.url) throw new Error("Upload failed: No file URL returned");
      return uploadedFile;
    } catch (error) {
      console.error("Media Upload Error:", error);
      throw error;
    }
  };
