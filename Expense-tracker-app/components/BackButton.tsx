import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { BackButtonProps } from '@/types'
import { useRouter } from 'expo-router';

const BackButton = (
    {
    style,
    iconSize = 26
    }:BackButtonProps) => {
   const router = useRouter();
  return (
    <TouchableOpacity onPress={()=> router.back()} style={[styles.button, style]}>
      <Text>BackButton</Text>
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({})