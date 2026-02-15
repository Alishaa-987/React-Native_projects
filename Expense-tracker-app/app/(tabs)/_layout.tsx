import { StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import { colors } from '@/constants/theme'

const _layout = () => {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textLight,
      tabBarStyle: {
        backgroundColor: colors.neutral800,
        borderTopColor: colors.neutral700,
        borderTopWidth: 1,
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icons.House size={size} color={color} weight="fill" />
          ),
        }}
      />

      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color, size }) => (
            <Icons.ChartPie size={size} color={color} weight="fill" />
          ),
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <Icons.Wallet size={size} color={color} weight="fill" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icons.User size={size} color={color} weight="fill" />
          ),
        }}
      />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})