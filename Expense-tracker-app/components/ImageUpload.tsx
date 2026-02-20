import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native'
import React from 'react'
import { ImageUploadProps } from '@/types'
import * as Icons from 'phosphor-react-native'
import { colors, radius } from '@/constants/theme'
import Typo from '@/components/Typo'
import { scale, verticalScale } from '@/utills/styling'
import { Image } from 'expo-image'
import { getFilePath } from '@/services/imageService'
import * as ImagePicker from 'expo-image-picker'
const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = ""
} : ImageUploadProps) => {

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selected = result.assets[0];
        onSelect && onSelect(selected);
      }
    } catch (error) {
      console.log('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  }
  return (
    <View>
      {
        !file && (
          <TouchableOpacity
          onPress={pickImage}
           style={[styles.inputContainer,  containerStyle && containerStyle]}>
            < Icons.UploadSimple color={colors.neutral200}/>
            {placeholder && <Typo size={15}> {placeholder} </Typo>}
          </TouchableOpacity>
        )}

      {

        file && (
          <View style={[styles.image, imageStyle && imageStyle]}>
            <Image
             style={{flex: 1}}
             source={getFilePath(file)}
             contentFit='cover'
             transition={100}
             />
             <TouchableOpacity style={styles.deleteIcon} onPress={() => onClear && onClear()}>
              <Icons.XCircle
                size={verticalScale(24)}
                weight="fill"
                color={colors.white}
              />
             </TouchableOpacity>
          </View>
        )
      }
    </View>
  )
}

export default ImageUpload

const styles = StyleSheet.create({
  inputContainer:{
    height: verticalScale(54),
    backgroundColor: colors.neutral700,
    borderRadius: radius._15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderStyle: 'dashed',
  },
 image:{
  height: scale(150),
  width: scale(150),
  borderRadius: radius._15,
  borderCurve: "continuous",
  overflow: "hidden"
 },
 deleteIcon:{
  position: "absolute",
  top: scale(6),
  right: scale(6),
  shadowColor: colors.black,
  shadowOffset: {width: 0 , height: 5},
  shadowOpacity: 1,
  shadowRadius: 10,
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 20,
  padding: 4,
 },
})