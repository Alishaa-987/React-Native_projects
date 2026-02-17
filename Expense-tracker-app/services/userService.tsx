import { fireStore } from "@/config/firebase";
import { UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const updateUser = async (
    uid: string,
    updatedData: UserDataType
): Promise<{ success: boolean; msg?: string; error?: string }> => {
    try {
        console.log("Updating user:", uid, "with data:", updatedData);
        
        if (updatedData.image && updatedData.image?.uri) {
            console.log("Image URI found, uploading to Cloudinary...");
            const imageUploadRes = await uploadFileToCloudinary(updatedData.image, "users");
            
            if (!imageUploadRes.success) {
                const errorMsg = imageUploadRes.msg || "Failed to upload image";
                console.log("Image upload failed:", errorMsg);
                return {
                    success: false,
                    msg: errorMsg
                };
            }
            
            console.log("Image uploaded successfully:", imageUploadRes.data);
            updatedData.image = imageUploadRes.data;
        }
        
        const userRef = doc(fireStore, "users", uid);
        await updateDoc(userRef, updatedData);
        
        console.log("User document updated successfully");
        return { success: true, msg: "Updated Successfully" };
    } catch (error: any) {
        console.log("Error updating user:", error);
        return { success: false, error: error.message };
    }
};