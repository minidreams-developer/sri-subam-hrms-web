import { useId, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import UploadIcon from "../assets/images/employee/upload2.svg";
import { uploadMedia } from "../helpers/uploadMedia";
import theme from "../theme/theme";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const ProfileImageUpload = ({ value, onChange, label = "Profile Image" }) => {
  const inputId = useId();
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      toast.error("Please select a JPG, PNG, WEBP, or GIF image");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Profile picture must be 5 MB or smaller");
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const uploadedFile = await uploadMedia(file, setProgress);
      setFileName(uploadedFile.originalName || file.name);
      onChange?.(uploadedFile.url, uploadedFile);
      toast.success("Profile picture uploaded");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Profile picture upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Wrapper>
      <UploadLabel>{label}</UploadLabel>
      <UploadArea as="label" htmlFor={inputId} $disabled={uploading}>
        <input
          id={inputId}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.gif"
          onChange={handleFileChange}
          disabled={uploading}
          hidden
        />
        {value && <Preview src={value} alt="Profile preview" />}
        <UploadContent>
          <img src={UploadIcon} alt="" width="32" height="32" />
          <UploadText>
            {uploading ? `Uploading${progress ? ` ${progress}%` : "..."}` : fileName || (value ? "Change Image" : "Upload Image")}
          </UploadText>
        </UploadContent>
      </UploadArea>
    </Wrapper>
  );
};

const Wrapper = styled.div`width: 100%;`;
const UploadLabel = styled.p`
  font-size: 0.875rem; font-weight: 500; line-height: 160%;
  color: ${theme.colors.primaryGreen}; margin: 0 0 0.625rem;
`;
const UploadArea = styled.div`
  width: 100%; min-height: 150px; border: 2px dashed ${theme.colors.primary};
  border-radius: 0.625rem; background: #066c781a; display: flex;
  align-items: center; justify-content: center; gap: 1rem; cursor: pointer;
  opacity: ${({ $disabled }) => ($disabled ? 0.65 : 1)};
`;
const UploadContent = styled.div`display: flex; flex-direction: column; align-items: center; gap: 0.5rem;`;
const UploadText = styled.p`font-size: 0.875rem; font-weight: 500; color: ${theme.colors.primary}; margin: 0;`;
const Preview = styled.img`width: 88px; height: 88px; border-radius: 50%; object-fit: cover;`;

export default ProfileImageUpload;
