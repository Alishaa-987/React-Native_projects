import { colors } from "@/constants/theme";
import { ScreenWrapperProps } from "@/types";
import { View, StatusBar } from "react-native";
const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {

  return (
    <View
      style={[
        {  flex: 1, backgroundColor: colors.neutral900 },
        style,
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral900} />
      {children}
    </View>
  );
};

export default ScreenWrapper;
