import React from 'react'
import { View, StyleSheet } from 'react-native'
import Typo from '@/components/Typo'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors } from '@/constants/theme'

const Statistics = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Typo size={20} fontWeight="700" color={colors.text}>
          Statistics
        </Typo>
      </View>
    </ScreenWrapper>
  )
}

export default Statistics

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
