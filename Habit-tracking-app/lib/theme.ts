import { MD3LightTheme } from "react-native-paper";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#1976d2", // blue
    background: "#f5f5f5",
    surface: "#ffffff",
    text: "#000000",
    onSurfaceVariant: "#6e6e6e",
    error: "#b00020",
  },
};

export default theme;
