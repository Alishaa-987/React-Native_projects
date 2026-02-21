import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utills/styling";
import Typo from "@/components/Typo";
import { useAuth } from "@/contexts/authContext";
import * as Icons from "phosphor-react-native";
import HomeCard from "@/components/HomeCard";
import TransactionList from "@/components/TransactionList";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo size={20} fontWeight={"500"}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity style={styles.searchIcon}>
            <Icons.MagnifyingGlass
              size={verticalScale(22)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroolView}
          showsVerticalScrollIndicator={false}
        >
          {/* card */}
          <View>
            <HomeCard />
          </View>
          <TransactionList
            data={[1, 2, 3, 4, 5, 6]}
            loading={false}
            emptyListMessage="No Transaction edit yet!"
            title="Recent Transactions"
          />
        </ScrollView>
        <Button
        style={styles.floatingButton} 
        onPress={()=>router.push('/(models)/transactionModal')}
        >
          <Icons.Plus
          color={colors.black}
          weight="bold"
          size={verticalScale(24)}/>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._20,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scroolView: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
