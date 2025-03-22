import { Tabs } from 'expo-router';
import { Colors } from '../../style/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.navigation.main,
        tabBarInactiveTintColor: Colors.navigation.light,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bibliothèque',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="library" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: 'Révisions du jour',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clock" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Apprentissage',
          headerShown: false,
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
