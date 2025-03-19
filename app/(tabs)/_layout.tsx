import { Tabs } from 'expo-router';
import { Colors } from '../../style/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.main,
        tabBarInactiveTintColor: Colors.secondary.main,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          title: 'Bibliothèque',
          tabBarIcon: ({ color }) => (
            <Ionicons name="library" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: 'Révisions du jour',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clock" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Apprentissage',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="cards-heart"
              size={25}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
