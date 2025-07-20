import React from 'react';
import { Tabs } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useGroups } from '@/hooks/use-groups-store';
import { Award, List, PlusCircle } from 'lucide-react-native';

export default function GroupTabsLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getGroupById } = useGroups();
  
  const group = getGroupById(id);
  
  if (!group) return null;
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8A2BE2',
        headerStyle: { backgroundColor: '#8A2BE2' },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: group.name,
          tabBarLabel: 'Leaderboard',
          tabBarIcon: ({ color }) => <Award color={color} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Aura Log',
          tabBarLabel: 'Log',
          tabBarIcon: ({ color }) => <List color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-points"
        options={{
          title: 'Add Aura Points',
          tabBarLabel: 'Add Points',
          tabBarIcon: ({ color }) => <PlusCircle color={color} />,
        }}
      />
    </Tabs>
  );
}