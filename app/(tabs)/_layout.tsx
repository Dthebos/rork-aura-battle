import { Tabs } from "expo-router";
import { Home, Users, PlusCircle } from "lucide-react-native";
import React from "react";
import { useAuth } from "@/hooks/use-auth-store";
import { Redirect } from "expo-router";

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8A2BE2",
        headerShown: true,
        headerStyle: { backgroundColor: '#8A2BE2' },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarStyle: { paddingBottom: 4 }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Groups",
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create Group",
          tabBarIcon: ({ color }) => <PlusCircle color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Users color={color} />,
        }}
      />
    </Tabs>
  );
}