import { fireStore } from "@/config/firebase";
import { TransactionType, WalletType, ResponseType } from "@/types";
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";
import { createOrUpdateWallet } from "./walletService";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>,
): Promise<ResponseType> => {
  try {
    const { id, type, amount, walletId, image } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data!", data: null };
    }

    if (id) {
      const oldTransactionSnapShot = await getDoc(
        doc(fireStore, "transactions", id),
      );
      const oldTransaction = oldTransactionSnapShot.data() as TransactionType;
      const shouldRevertOrignal =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        oldTransaction.walletId != walletId;

      if (shouldRevertOrignal) {
        let res = await revertAndUpdateWallet(
          oldTransaction,
          Number(amount),
          type,
          walletId,
        );
        if (res.success) return res;
      }
    } else {
      //update wallet for new transaction
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type!,
      );
      if (!res.success) return res;
    }

    if (image) {
      const imageUploadRes = await uploadFileToCloudinary(
        image,
        "transactoins",
      );

      if (!imageUploadRes.success) {
        const errorMsg = imageUploadRes.msg || "Failed to upload receipt";
        console.log("Image upload failed:", errorMsg);
        return {
          success: false,
          msg: errorMsg,
        };
      }

      transactionData.image = imageUploadRes.data;
    }

    const transactionRef = id
      ? doc(fireStore, "transactions", id)
      : doc(collection(fireStore, "transactions"));

    await setDoc(transactionRef, transactionData, { merge: true });
    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (err: any) {
    console.log("error creating or updating transaction:", err);
    return { success: false, msg: err.message };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string,
) => {
  try {
    const walletRef = doc(fireStore, "wallets", walletId);
    const walletSnapShot = await getDoc(walletRef);
    if (!walletSnapShot.exists()) {
      console.log("error updating wallet for new transaction");
      return { success: false, msg: "Wallet not found" };
    }
    const walletData = walletSnapShot.data() as WalletType;

    if (type === "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Selected wallet dont have enough balance ",
      };
    }

    const updatedType = type === "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type === "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updatedTotals =
      type === "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updatedType]: updatedTotals,
    });
    return { success: true };
  } catch (err: any) {
    console.log("error updating the wallet for new transaction:", err);
    return { success: false, msg: err.message };
  }
};

const revertAndUpdateWallet = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string,
) => {
  try {
    const OrignalWalletSnapShot = await getDoc(
      doc(fireStore, "wallets", oldTransaction.walletId),
    );

    const orignalWallet = OrignalWalletSnapShot.data() as WalletType;
    let newWalletSnapShot = await getDoc(
      doc(fireStore, "wallets", newWalletId),
    );
    let newWallet = newWalletSnapShot.data() as WalletType;
    const revertType =
      oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpenses: number =
      oldTransaction.type == "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertedWalletAmount =
      Number(orignalWallet.amount) + revertIncomeExpenses;

    const revertedIncomeExpenseAmount =
      Number(orignalWallet[revertType]) - Number(oldTransaction.amount);
    if (newTransactionType == "expense") {
      if (
        oldTransaction.walletId == newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet dont have enough balance",
        };
      }
      // if user tries to update expense from a new wallet but the wallet dont have enough balance
      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: "The selected wallet dont have enough balance",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    newWalletSnapShot = await getDoc(doc(fireStore, "wallets", newWalletId));
    newWallet = newWalletSnapShot.data() as WalletType;

    const updateType =
      newTransactionType == "income" ? "totalIncome" : "totalExpenses";

    const updatedTransactionAmount: number =
      newTransactionType == "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

    const newIncomeExpenseAmount = Number(
      newWallet[updateType]! + updatedTransactionAmount,
    );

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    return { success: true };
  } catch (err: any) {
    console.log("error updating the wallet for new transaction:", err);
    return { success: false, msg: err.message };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId: string,
) => {
  try {

    const transactionRef = doc(fireStore, "transactions", transactionId);

    const TransactionSnapShot = await getDoc(transactionRef);

      if(!TransactionSnapShot.exists()){
        return { success: false , msg: "Transaction not found"};
      }
      const transactionData = TransactionSnapShot.data() as TransactionType;
      const TransactionType = transactionData?.type;
      const TransactionAmount = transactionData?.amount;

      // fetch wallet to update amount , totalIcome or totalExpense 
    const  WalletSnapShot = await getDoc(doc(fireStore, "wallets", walletId));
    const newWallet = WalletSnapShot.data() as WalletType;


    // check files to be updated on transaction type

    const updateType = TransactionType =='income' ? 'totalIncome': 'totalExpenses';
    const newWalletAmount = (newWallet?.amount || 0) - (TransactionType == 'income' ? TransactionAmount: -TransactionAmount );

    const newIncomeExpenseAmount = newWallet[updateType]! - TransactionAmount;
    if(TransactionType == 'expense' && newWalletAmount< 0){
      return { success: false, msg: "You cannt delete this transaction"};
    }

    await createOrUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount
    });
    await deleteDoc(transactionRef);
    return { success: true };
  } catch (err: any) {
    console.log("error updating the wallet for new transaction:", err);
    return { success: false, msg: err.message };
  }
};
