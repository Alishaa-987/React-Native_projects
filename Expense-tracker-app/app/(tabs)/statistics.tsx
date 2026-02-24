import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from "@/services/transactionService";
import { scale, verticalScale } from "@/utills/styling";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

// Green color for income bars
const INCOME_COLOR = "#a3e635";
// Red color for expense bars  
const EXPENSE_COLOR = "#ef4444";


const Statistics = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const {user} = useAuth()
  const [chartLoading , setChartLoading] = useState(false)
  const [chartData, setChartData] = useState([]);
  const [transaction, setTransaction] = useState([]);

      useEffect(()=>{
        if(activeIndex === 0){
          getWeeklyStats();
        }

          if(activeIndex === 1){
            getMonthlyStats();
        }

          if(activeIndex === 2){
          getYearStats();
        }
    },[activeIndex])

    const getWeeklyStats = async ()=>{
      setChartLoading(true);
      let res = await fetchWeeklyStats(user?.uid as string)
      setChartLoading(false)
      if(res.success){
        setChartData(res?.data?.stats);
        setTransaction(res?.data?.transactions);
      }else{
        Alert.alert("Error", res.msg)
      }
    }

    const getMonthlyStats = async()=>{
      setChartLoading(true);
      let res = await fetchMonthlyStats(user?.uid as string)
      setChartLoading(false)
      if(res.success){
        setChartData(res?.data?.stats);
        setTransaction(res?.data?.transactions);
      }else{
        Alert.alert("Error", res.msg)
      }
    }

    const getYearStats = async()=>{
      setChartLoading(true);
      let res = await fetchYearlyStats(user?.uid as string)
      setChartLoading(false)
      if(res.success){
        setChartData(res?.data?.stats);
        setTransaction(res?.data?.transactions);
      }else{
        Alert.alert("Error", res.msg)
      }
    }
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Statistics" />
        </View>
        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          <SegmentedControl
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance="dark"
            activeFontStyle={styles.segmentFontStyle}
            style={styles.segmentStyle}
            fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
          />
          
          {/* Chart Section Title */}
          <View style={styles.chartTitleContainer}>
            <Typo size={18} fontWeight="600" color={colors.white}>
              Weekly Overview
            </Typo>
          </View>

          <View style={styles.chartContainer}>
            {chartData.length > 0 ? (
              <BarChart
                data={chartData}
                barWidth={20}
                spacing={15}
                roundedTop
                roundedBottom
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisTextStyle={{ color: colors.neutral400 }}
                xAxisLabelTextStyle={{ color: colors.white, fontSize: 12 }}
                noOfSections={5}
                minHeight={5}
                hideRules
                // Removed fixed width to prevent clipping
                // width={scale(310)}
                // maxValue={100}
                // isAnimated={true}
                // animationDuration={100}
              />
            ) : (
              <View style={styles.noChart} />
            )}

            {
              chartLoading && (
              <View style={styles.chartLoadingContainer}>
                <Loading color={colors.white}/>
              </View>
              )
            }

        </View>

        {/*  transactions */}
        <View>
          <TransactionList
          title="Transactions"
          emptyListMessage="No transaction found"
          data={transaction}
          />
        </View>

        

        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  chartContainer: {
    // Removed alignItems: "center" to prevent clipping of Mon-Wed labels
    justifyContent: "center",
    marginTop: spacingY._5,
    paddingVertical: spacingY._20,
    paddingBottom: verticalScale(20),
  },
  chartTitleContainer: {
    marginTop: spacingY._10,
  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  header: {},
  noChart: {
    backgroundColor: "rgba(0,0,0,0.6)",
    height: verticalScale(210),
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacingX._30,
    marginTop: spacingY._20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous",
  },
  segmentStyle: {
    height: scale(37),
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black,
  },
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
});
