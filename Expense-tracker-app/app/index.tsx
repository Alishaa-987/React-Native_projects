import { View, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '@/constants/theme'
import { useRouter } from 'expo-router';
export default function Index () {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            router.replace('/(auth)/welcome')
        }, 2000)
    })


    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                resizeMode="contain"
                source={require("../assets/images/splashImage.png")}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral900
    },
    logo: {
        height: '20%',
        aspectRatio: 1,


    }
})