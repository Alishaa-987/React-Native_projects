import { View, StyleSheet, Image } from 'react-native'
import { colors } from '@/constants/theme'
import { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';
export default function Index () {
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        if (pathname !== '/') return; // don't override deep links or other routes
        const t = setTimeout(() => {
            router.replace('/(auth)/welcome')
        }, 2000)
        return () => clearTimeout(t)
    }, [pathname])


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