import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigationState } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FavoritesListScreen from '@/components/FavoritesListScreen';
import Header from '@/components/AppHeader';
import HomeScreen from '../HomeScreen';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const navigationState = useNavigationState(state => state);

  // Kiểm tra nếu hiện tại đang ở trang Detail
  const isDetailScreen = navigationState.routes[navigationState.index].name === 'Detail';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: isDetailScreen ? 'none' : 'flex' }, // Ẩn Bottom Tab khi ở trang Detail
      }}
    >
      <Tab.Screen
        options={{
          unmountOnBlur: true,
          tabBarIcon: () => <Entypo name="home" size={24} color="white" />,
        }}
        name="HomeTab"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{
          // header: () => <Header page='favorite' />,
          unmountOnBlur: true,
          tabBarIcon: () => <MaterialIcons name="favorite" size={24} color="white" />,
        }}
        name="Favorite List"
        component={FavoritesListScreen}
      />
    </Tab.Navigator>
  );
}
