import { Alert, Pressable, StyleSheet, View } from "react-native";

import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utills/styling";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/input";
import * as Icons from "phosphor-react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
const Register = () => {
  const eamilRef = useRef("");
  const passwordRef = useRef("");
    const nameRef = useRef("");

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = () => {
    if(!eamilRef.current || !passwordRef.current || ! nameRef.current){
        Alert.alert("SignUp", "Please fill all the fields");
        return;
    }
    console.log("name:" , nameRef.current);
    console.log("eamil:" , eamilRef.current);
    console.log("passowrd:" , passwordRef.current);
    console.log("good to go");
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* back button */}
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight="bold">
            Lets ,
          </Typo>
          <Typo size={30} fontWeight="bold">
            Get Started
          </Typo>
        </View>
        {/* form */}

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            create an account . Trak all your expenses in one place
          </Typo>
             <Input
            placeholder="Enter your name"
            onChangeText={(value) => (nameRef.current = value)}
            icon={
              <Icons.User
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
          <Input
            placeholder="Enter your email"
            onChangeText={(value) => (eamilRef.current = value)}
            icon={
              <Icons.At
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
       
          <Input
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
            icon={
              <Icons.Lock
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />  
            }
          />
       

          <Button loading={isLoading} onPress={handleSubmit} >
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              {" "}
              SignUp
            </Typo>
          </Button>
        </View>

        {/* footer */}

        <View style={styles.footer}>
          <Typo size={15} color={colors.textLighter}>
            Already have an account?
          </Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
             <Typo size={15} fontWeight="bold" color={colors.primary}>
            Login
          </Typo>
          </Pressable>
         
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
