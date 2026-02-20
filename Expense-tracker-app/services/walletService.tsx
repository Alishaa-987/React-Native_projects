import { ResponseType, WalletType } from "@/types";
import { uploadFileToCloudinary } from "./imageService";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { fireStore } from "@/config/firebase";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>,
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };
    if (walletData.image) {
      console.log("Image URI found, uploading to Cloudinary...");
      const imageUploadRes = await uploadFileToCloudinary(
        walletData.image,
        "wallets",
      );

      if (!imageUploadRes.success) {
        const errorMsg = imageUploadRes.msg || "Failed to upload wallet icon";
        console.log("Image upload failed:", errorMsg);
        return {
          success: false,
          msg: errorMsg,
        };
      }

      console.log("Image uploaded successfully:", imageUploadRes.data);
      walletToSave.image = imageUploadRes.data;
      
    }

    const walletRef = walletData?.id
      ? doc(fireStore, "wallets", walletData.id)
      : doc(collection(fireStore, "wallets"));

    if (!walletData?.id) {
      // new data defaults
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    await setDoc(walletRef, walletToSave, { merge: true }); // create or update the data provided
    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    console.log("error creating or updaging wallet:", error);
    return { success: false, msg: error.message };
  }
};


export const deleteWallet = async (walletId: string): Promise<ResponseType>=>{
    try{
        const walletRef = doc(fireStore, "wallets" , walletId);
        await deleteDoc(walletRef);

        // todo: delete all the transaction related to this wallet

        return {success: true, msg: "wallet deleted successfully"}
    }catch(err:any){
        console.log('error deleting wallet:' , err)
        return {success: false, msg: err.message}
    }
}