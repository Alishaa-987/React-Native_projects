import { StyleSheet } from 'react-native'
import React from 'react'
import Typo from '@/components/Typo';
import { useAuth } from '@/contexts/authContext';
import ScreenWrapper from '@/components/ScreenWrapper';

const Home = () => {
  const {user} = useAuth();

  // console.log(user);

  // const hadelLogout = async () =>{
  //   await signOut(auth);
  // };
  return (
    <ScreenWrapper>
      <Typo>Home</Typo>
{/* 
      <Button onPress={hadelLogout}>
        <Typo color={colors.black}>Logout</Typo>
      </Button> */}
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})