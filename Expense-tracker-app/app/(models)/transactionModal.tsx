import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utills/styling";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { WalletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteWallet } from "@/services/walletService";
import * as Icons from "phosphor-react-native";
import { Dropdown } from "react-native-element-dropdown";
import { expenseCategories, transactionTypes } from "@/constants/data";
import ImageUpload from "@/components/ImageUpload";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Input from "@/components/input";
import { TransactionType } from "@/types";

const TransactionModal = () => {
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const oldTransaction: { name: string; id: string; image: string } =
    useLocalSearchParams();

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setTransaction({ ...transaction, date: selectedDate });
    }

    setShowDatePicker(false);
  };
  // useEffect(() => {
  //   if (oldTransaction?.id) {
  //     setTransaction({
  //       name: oldTransaction?.name,
  //       image: oldTransaction?.image,
  //     });
  //   }
  // }, []);

  const onSubmit = async () => {
    const {type, amount, description, category, date, walletId, image} = transaction;
    if(!walletId ||!date || !amount || (type === 'expense' && !category) ){
      Alert.alert("Transaction", "Please fill all the fields");
      return ;
    }
    console.log('good to go ')
    let transactionData : TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image,
      uid: user?.uid
    }
    console.log('Transaction data:' , transactionData);
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldTransaction?.id);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      " Are you sure you want to do this?\n This action will remove all the trasaction realted to the wallet",

      [
        {
          text: "Cancel",
          onPress: () => console.log("cancel delete"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ],
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Update Transaction" : "New Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* form */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsHorizontalScrollIndicator={false}
        >
          {/* transaction types */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}> Type</Typo>
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              // placeholderStyle={styles.dropdonwPlceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdonwIcon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdonwItemText}
              itemContainerStyle={styles.dropdonwItemContainer}
              containerStyle={styles.dropdownListContainer}
              // placeholder={!isFocus ? "Select item" : "..."}
              value={transaction.type}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
            />
          </View>
          {/* wallet category */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}> Wallet</Typo>
            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdonwPlceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdonwIcon}
              data={wallets.map((wallet) => ({
                label: `${wallet?.name} ($${wallet.amount})`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdonwItemText}
              itemContainerStyle={styles.dropdonwItemContainer}
              containerStyle={styles.dropdownListContainer}
              placeholder={"Select item"}
              value={transaction.walletId}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value });
              }}
            />
          </View>
          {/* expense category */}
          {transaction.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}> Expense Category</Typo>
              <Dropdown
                style={styles.dropdownContainer}
                activeColor={colors.neutral700}
                placeholderStyle={styles.dropdonwPlceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropdonwIcon}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                itemTextStyle={styles.dropdonwItemText}
                itemContainerStyle={styles.dropdonwItemContainer}
                containerStyle={styles.dropdownListContainer}
                placeholder={"Select category"}
                value={transaction.category}
                onChange={(item) => {
                  setTransaction({ ...transaction, category: item.value });
                }}
              />
            </View>
          )}
          {/* Date Picker */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}> Date</Typo>
            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}

            {showDatePicker && (
              <View style={Platform.OS === "android" && styles.iosDatePicker}>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={15} fontWeight={"500"}>
                      Ok
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* amount */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}> Amount</Typo>
            <Input
              // placeholder="Salary"
              keyboardType="numeric"
              value={transaction.amount?.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}> Description</Typo>
              <Typo color={colors.neutral500} size={14}> (Optional)</Typo>
            </View>
            <Input
              // placeholder="Salary"
              value={transaction.description}
              multiline
              containerStyle={{
                flexDirection: 'row',
                height: verticalScale(100),
                alignItems: 'flex-start',
                paddingVertical: 15
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            />
          </View>


          <View style={styles.inputContainer}>
 <View style={styles.flexRow}>
              <Typo color={colors.neutral200} size={16}> Receipt</Typo>
              <Typo color={colors.neutral500} size={14}> (Optional)</Typo>
            </View>            {/* drodonw here */}
            <ImageUpload
              file={transaction.image}
              onClear={() => setTransaction({ ...transaction, image: null })}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              placeholder="Upload Image"
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            {oldTransaction?.id ? "Update Wallet" : "Submit"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  androidDorpDown: {
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {},
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdonwItemText: { color: colors.white },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdonwItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdonwIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdonwPlceholder: {
    color: colors.white,
  },
});
