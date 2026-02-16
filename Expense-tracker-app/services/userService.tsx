import { fireStore } from "@/config/firebase";
import { UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";

export const updateUser = async (
    uid: string,
    updatedData: UserDataType
): Promise<{ success: boolean; msg?: string; error?: string }> =>{
    try{
        const userRef = doc(fireStore, "users", uid);
        await updateDoc(userRef, updatedData);


// fetch the user and update the user
        return {success: true , msg: "Updated Successfully"};
    }catch(error: any){
        console.log("Error updating user:", error);
        return {success: false, error: error.message};
    }
};