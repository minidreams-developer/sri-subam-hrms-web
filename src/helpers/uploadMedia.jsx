import { uploadMediaFile } from "../services/apiServices";

export const uploadMedia = async (file, onProgress) => {
    const formData = new FormData();
    formData.append("upload", file);
  
    try {
      const response = await uploadMediaFile(formData, onProgress);
      const uploadedFile = response?.files?.[0] || response?.data?.files?.[0];
      if (!uploadedFile?.url) throw new Error("Upload failed: No file URL returned");
      // Keep the server URL exactly as returned. In particular, never turn it
      // into Markdown or rewrite /raw/upload/ URLs.
      return { ...uploadedFile, url: uploadedFile.url, mimeType: uploadedFile.mimeType || file.type };
    } catch (error) {
      console.error("Media Upload Error:", error);
      throw error;
    }
  };
