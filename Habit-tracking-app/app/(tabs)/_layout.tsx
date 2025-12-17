import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerStyle: {backgroundColor: '#f5f5f5'},
      headerShadowVisible: false,
      tabBarStyle: {backgroundColor: '#f5f5f5',
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: '#666'
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Today's Habits",
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
