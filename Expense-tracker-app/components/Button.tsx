import {StyleSheet  , TouchableOpacity, View} from 'react-native'
import React from 'react';
import { CustomButtonProps } from '@/types';
import { verticalScale } from '@/utills/styling';
import { colors, radius } from '@/constants/theme';
import Loading from './Loading';

const Button = ({
    style,
    onPress,
    loading = false,
    children
} : CustomButtonProps) => {   
    
    if(loading){
        return(
            <View style={[styles.button, style, {backgroundColor: 'transparent'}]}>
                <Loading/>
            </View>
        )
    }
    return(
        <TouchableOpacity onPress={onPress} style = {[styles.button, style]} disabled={loading}>
            {children}
        </TouchableOpacity>
    );
};
export default Button;

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: radius._17,
        borderCurve: "continuous",
        height: verticalScale(59),
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
    },
});