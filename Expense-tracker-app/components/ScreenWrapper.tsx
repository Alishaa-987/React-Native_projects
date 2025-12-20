import { colors } from '@/constants/theme';
import { ScreenWrapperProps } from '@/types';
import { View, Platform, StatusBar } from 'react-native';

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <View style={[{ paddingTop,
        flex: 1,
        backgroundColor: colors.neutral900,
     }, 
     style]}>
        <StatusBar barStyle="light-content" />
      {children}

    </View>
  );
};

export default ScreenWrapper;
