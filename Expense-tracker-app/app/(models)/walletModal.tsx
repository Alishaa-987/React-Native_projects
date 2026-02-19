import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Input from "@/components/input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utills/styling";
import React, { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import * as ImagePicker from "expo-image-picker";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { WalletType } from "@/types";
import Button from "@/components/Button";
import { updateUser } from "@/services/userService";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { createOrUpdateWallet } from "@/services/walletService";

const WalletModal = () => {
  const { user, updateUserData } = useAuth();
  const [walletData, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();



  const onSubmit = async () => {
    let { name, image } = walletData;
    if (!name.trim() || !image) {
      Alert.alert("Wallet", "Please fill all the fields");
      return;
    }
    console.log("Good to go ");
    const data: WalletType = {
        name,
        image,
        uid: user?.uid
    };
    // todo : include wallet id if updating
    setLoading(true);
    const res = await createOrUpdateWallet(data );
    setLoading(false);
    console.log("result", res)
    if (res.success) {
      //update user
      router.back();
    } else {
      Alert.alert("Wallet", res.msg || "Failed to update wallet");
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="New Wallet"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}> Wallet Name</Typo>
            <Input
              placeholder="Salary"
              value={walletData.name}
              onChangeText={(value) => setWallet({ ...walletData, name: value })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}> Wallet Icon</Typo>
            {/* image input */}
            <ImageUpload
              file={walletData.image}
              onClear={() => setWallet({ ...walletData, image: null })}
              onSelect={(file) => setWallet({ ...walletData, image: file })}
              placeholder=" Upload Image"
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            Add Wallet
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
