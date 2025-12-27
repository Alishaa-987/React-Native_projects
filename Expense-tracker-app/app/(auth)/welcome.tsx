import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Type'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import {  colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utills/styling';
const Welcome = () => {
  return (
    <ScreenWrapper>
      <View>
        <TouchableOpacity style={Styles.loginButton}>
          <Typo fontWeight={'500'}>
            Sign in
          </Typo>
        </TouchableOpacity>

        <Image
          source={require('../../assets/images/welcome.png')}
          style={Styles.WelcomeImage}
          resizeMode="contain"
        />
      </View>
     {/* footer */}
      <View style={Styles.footer}>
        <View style={{alignItems: "center"}}>
          <Typo size={30} fontWeight={"800"}>
            Always take control
          </Typo>
           <Typo size={30} fontWeight={"800"}>
            of your Finances
          </Typo>
        </View>
      </View>
    </ScreenWrapper>
  )
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacingY._7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // paddingHorizontal: spacingX._,
  },
  loginButton: {
  alignSelf: 'flex-end',
  marginRight: spacingX._20,
  },
  image: {
    height: verticalScale(300),
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: 2,
  },
  WelcomeImage:{
    width: '100%',
    height: verticalScale(300), 
    alignSelf: "center"
  },
  footer :{
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: 'white',
    shadowOffset: {width: 0, height: -10},
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15

  },
  buttonContainer:{
    width: 100,
    paddingHorizontal: spacingX._25,
  },
});

export default Welcome;