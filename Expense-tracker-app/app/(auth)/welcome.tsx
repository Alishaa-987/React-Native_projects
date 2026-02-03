import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Type";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utills/styling";
import Button from "@/components/Button";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const Welcome = () => {
  return (
    <ScreenWrapper>
      {/* Top Section: Sign In */}
      <View style={Styles.topSection}>
        <TouchableOpacity style={Styles.loginButton}>
          <Typo fontWeight={"600"} size={18} color={"white"}>
            Sign in
          </Typo>
        </TouchableOpacity>
      </View>

      {/* Animated Image */}
      <Animated.Image
        entering={FadeIn.duration(1000)}
        source={require("../../assets/images/welcome.png")}
        style={Styles.WelcomeImage}
        resizeMode="contain"
      />

      {/* Soft Whitish Glow above footer */}
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.18)",
          "rgba(255,255,255,0.10)",
          "rgba(255,255,255,0.04)",
          "transparent",
        ]}
        style={Styles.topGlow}
      />

      {/* Footer */}
      <View style={Styles.footer}>
        <Animated.View
          entering={FadeInDown.duration(1000).springify().damping(12)}
          style={{ alignItems: "center" }}
        >
          <Typo size={32} fontWeight={"800"}>
            Always take control
          </Typo>
          <Typo size={35} fontWeight={"800"} color={"white"}>
            of your Finances
          </Typo>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(1000)
            .delay(100)
            .springify()
            .damping(12)}
          style={{ alignItems: "center", gap: 2 }}
        >
          <Typo size={17} color={colors.textLight}>
            Finances must be arranged to set a
          </Typo>
          <Typo size={17} color={colors.textLight}>
            better LifeStyle in Future
          </Typo>
        </Animated.View>

      <Animated.View entering={FadeInDown.duration(1000).springify().damping(12)} style={{ alignItems: "center" }}>
          <Button>
            <Typo size={22} color={colors.neutral900} fontWeight={"600"}>
              Get Started
            </Typo>
          </Button>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
};

const Styles = StyleSheet.create({
  topSection: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._5, // adjust to move button up/down
  },
  loginButton: {
    alignSelf: "flex-end",
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  WelcomeImage: {
    width: "100%",
    height: verticalScale(300),
    marginTop: verticalScale(50),
    alignSelf: "center",
  },
  topGlow: {
    height: verticalScale(40), // soft fade height
    width: "100%",
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(40),
    paddingHorizontal: spacingX._20,
    gap: spacingY._15,
    elevation: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: spacingY._20,
  },
});

export default Welcome;
