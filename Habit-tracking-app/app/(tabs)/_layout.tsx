import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import theme from "@/lib/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today's Habits",
          headerShown: false,
          tabBarIcon: (props: any) => (
           <MaterialCommunityIcons
           name="calendar-today"
           size={props.size}
           color={props.color}
           />
          ),
        }}
      />

       <Tabs.Screen
        name="streaks"
        options={{
          title: "Streaks",
          tabBarIcon: (props: any) => (
           <MaterialCommunityIcons
           name="chart-line"
           size={props.size}
           color={props.color}
           />
          ),
        }}
      />

       <Tabs.Screen
        name="add-habbit"
        options={{
          title: "Add Habbit",
          tabBarIcon: (props: any) => (
           <MaterialCommunityIcons
           name="plus-circle"
           size={props.size}
           color={props.color}
           />
          ),
        }}
      />
    </Tabs>
  );
}
