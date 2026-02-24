import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Input from "@/components/input";
import ModalWrapper from "@/components/ModalWrapper";
import { colors, spacingY } from "@/constants/theme";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import TransactionList from "@/components/TransactionList";
const SearchModal = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [search, setSearch] = useState("");

  const constraints = [where("uid", "==", user?.uid), orderBy("date", "desc")];
  const {
    data: allTransactions,
    error,
    loading: transactionsLoading,
  } = useFetchData<TransactionType>("transactions", constraints);

  const filteredTransactions = allTransactions.filter((item) => {
    if (search.length > 1) {
      if (
        item.category
          ?.toLocaleLowerCase()
          ?.includes(search?.toLocaleLowerCase()) ||
        item.type?.toLowerCase()?.includes(search?.toLowerCase()) ||
        item.description
          ?.toLocaleLowerCase()
          ?.includes(search?.toLocaleLowerCase())
      ) {
        return true;
      }
      return false;
    }
    return true;
  });
  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={"Search"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Shoes"
              value={search}
              placeholderTextColor={colors.neutral400}
              containerStyle={{ backgroundColor: colors.neutral900 }}
              onChangeText={(value) => setSearch(value)}
            />
          </View>

          <View>
            <TransactionList
              loading={transactionsLoading}
              data={filteredTransactions}
              emptyListMessage="No transactions match your search Keywords"
            />
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },

  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },

  inputContainer: {
    gap: spacingY._10,
  },
});
