import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { ResponseType } from "@/types";
import axios from "axios";
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadFileToCloudinary = async (
  file: { uri: string } | string,
  folderName: string,
): Promise<ResponseType> => {
  try {
    if (typeof file === "string") {
      return { success: true, data: file };
    }
    if (file && file.uri) {
      const formData = new FormData();
      const fileName = file?.uri?.split("/").pop() || "file.jpg";
      
      formData.append("file", {
        uri: file.uri,
        type: "image/jpeg",
        name: fileName,
      } as any);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folderName);

      console.log("Uploading image to Cloudinary:", fileName);
      const response = await axios.post(CLOUDINARY_API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Upload image result:", response?.data?.secure_url || response?.data?.url);
      const imageUrl = response?.data?.secure_url || response?.data?.url;
      
      if (!imageUrl) {
        return { success: false, msg: "No URL returned from upload" };
      }
      
      return { success: true, data: imageUrl };
    }
    return { success: false, msg: "No file provided" };
  } catch (error: any) {
    console.log("Error uploading file:", error?.message || error);
    return { success: false, msg: error?.message || "Could not upload file" };
  }
};

export const getProfileImage = (file: any) => {
  if (file && typeof file === "string") return file;
  if (file && typeof file === "object") return file.uri;

  return require("../assets/images/defaultAvatar.png");
};
