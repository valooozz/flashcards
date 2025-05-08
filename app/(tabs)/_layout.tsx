import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { Colors } from '../../style/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.navigation.main,
        tabBarInactiveTintColor: Colors.navigation.light,
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bibliothèque',
          tabBarIcon: () => (
            <Ionicons
              name="library"
              size={25}
              color={Colors.library.dark.main}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="daily"
        options={{
          title: 'Révisions du jour',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="clock"
              size={25}
              color={Colors.daily.dark.main}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Apprentissage',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="cards-heart"
              size={25}
              color={Colors.learning.dark.main}
            />
          ),
        }}
      />
    </Tabs>
  );
}
