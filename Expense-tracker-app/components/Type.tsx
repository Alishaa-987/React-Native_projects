import { View, Text, TextStyle } from 'react-native'
import React from 'react'
import { TypoProps } from '@/types'
import { verticalScale } from '@/utills/styling'
import { colors } from '@/constants/theme'

const Type = ({
    size,
    color = colors.text,
    fontWeight = "400",
    children,
    style,
    textProps = {}
}: TypoProps) => {
    const testStyle: TextStyle = {
        fontSize: size ? verticalScale(size) : verticalScale(18),
        color,
        fontWeight,
    }
    return (
        <View>
            <Text style={[testStyle, style]} {...textProps}>{children}</Text>
        </View>
    )
}

export default Type