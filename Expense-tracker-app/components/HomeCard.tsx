import { StyleSheet, View } from "react-native";
import React from "react";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utills/styling";
import { ImageBackground } from "expo-image";
import * as Icons from "phosphor-react-native";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
const HomeCard = () => {
  const { user } = useAuth();
  const {
    data: wallets,
    error,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const getTotals = () => {
    const totals = wallets.reduce(
      (acc:any, item:WalletType) => {
        const income = Number(item.totalIncome || 0);
        const expenses = Number(item.totalExpenses || 0);
        const walletAmount = Number(item.amount || 0);
        // Income is cumulative total
        acc.income = acc.income + income;
        // Expenses is cumulative total
        acc.expenses = acc.expenses + expenses;
        // Balance is sum of all wallet amounts (same as wallet tab)
        acc.balance = acc.balance + walletAmount;
        return acc;
      },
      { balance: 0, income: 0, expenses: 0 },
    );
    return totals;
  };
  return (
    <ImageBackground
      source={require("../assets/images/card.png")}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View>
          {/* total balance */}
          <View style={styles.totalBalanceRow}>
            <Typo color={colors.neutral800} size={17} fontWeight={"500"}>
              Total Balance
            </Typo>
            <Icons.DotsThreeOutlineIcon
              size={verticalScale(23)}
              color={colors.black}
              weight="fill"
            />
          </View>
          <Typo color={colors.black} size={30} fontWeight={"bold"}>
            $ {walletLoading ? "---" : getTotals()?.balance?.toFixed(2)}
          </Typo>
        </View>
        {/* total expense and income */}
        <View style={styles.stats}>
          {/* income */}
          <View style={styles.incomeExpense}>
            <View style={styles.statsIcon}>
              <Icons.ArrowDownIcon
                size={verticalScale(15)}
                color={colors.black}
                weight="bold"
              />
            </View>
            <View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Income
              </Typo>
              <View style={{ alignSelf: "center" }}>
                <Typo size={17} color={colors.green} fontWeight={"600"}>
            $ {walletLoading ? "---" : getTotals()?.income?.toFixed(2)}
                </Typo>
              </View>
            </View>
          </View>
          {/* expense */}
          <View style={styles.incomeExpense}>
            <View style={styles.statsIcon}>
              <Icons.ArrowUpIcon
                size={verticalScale(15)}
                color={colors.black}
                weight="bold"
              />
            </View>
            <View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Expense
              </Typo>
              <View style={{ alignSelf: "center" }}>
                <Typo size={17} color={colors.rose} fontWeight={"600"}>
            $ {walletLoading ? "---" : getTotals()?.expenses?.toFixed(2)}
                </Typo>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%",
  },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
});
