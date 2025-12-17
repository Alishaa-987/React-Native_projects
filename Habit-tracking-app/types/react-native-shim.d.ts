// Temporary shim: treat core React Native components as `any` to avoid JSX/type mismatch
// Replace with proper type alignment later by fixing @types/react / @types/react-native versions.

declare module 'react-native' {
  import * as RN from 'react-native';
  export const View: any;
  export const Text: any;
  export const KeyboardAvoidingView: any;
  export const TextInput: any;
  export const StyleSheet: any;
  export const Platform: any;
  export default RN;
}
