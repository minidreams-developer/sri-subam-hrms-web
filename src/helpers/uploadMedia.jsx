import { postFormData } from "../helpers/api_helper";
import { MEDIA } from "../helpers/url_helper";

export const uploadMedia = async (file, onProgress) => {
    const formData = new FormData();
    formData.append("upload", file);
  
    try {
      const response = await postFormData(MEDIA, formData, onProgress);
      if (response?.data?.link?.[0]) {
        return response.data.link[0];
      } else {
        throw new Error("Upload failed: No link returned");
      }
    } catch (error) {
      console.error("Media Upload Error:", error);
      throw error;
    }
  };