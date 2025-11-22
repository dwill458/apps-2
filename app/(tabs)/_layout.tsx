/**
 * Tabs Layout
 * Bottom tab navigation
 */

import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '../../src/constants';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary.sage,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarStyle: {
          backgroundColor: Colors.background.card,
          borderTopColor: Colors.background.secondary,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon icon="🏡" color={color} />,
        }}
      />
      <Tabs.Screen
        name="garden"
        options={{
          title: 'Garden',
          tabBarIcon: ({ color }) => <TabIcon icon="🌱" color={color} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => <TabIcon icon="📖" color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <TabIcon icon="🛒" color={color} />,
        }}
      />
    </Tabs>
  );
}

// Simple icon component
const TabIcon = ({ icon, color }: { icon: string; color: string }) => (
  <Text style={{ fontSize: 24 }}>{icon}</Text>
);
