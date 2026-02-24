import { View, StyleSheet, Image } from 'react-native'
import { colors } from '@/constants/theme'
import { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';

export default function Index () {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname !== '/') return;
        
        // Subscribe to auth state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // Use setTimeout to ensure navigation happens after render
            const t = setTimeout(() => {
                if (user) {
                    // User is logged in, go to home tab
                    router.replace('/(tabs)');
                } else {
                    // User is not logged in, go to welcome
                    router.replace('/(auth)/welcome');
                }
            }, 2000);
            
            return () => clearTimeout(t);
        });

        // Cleanup subscription
        return () => {
            unsubscribe();
        };
    }, []);

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
