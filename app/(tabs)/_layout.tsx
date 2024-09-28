
import React from 'react';
const Tab = createBottomTabNavigator();
import Entypo from '@expo/vector-icons/Entypo';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '.';
import FavoritesListScreen from '@/components/FavoritesListScreen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Header from '@/components/AppHeader';
export default function TabLayout() {

  return (
    <Tab.Navigator >
      <Tab.Screen
        options={{ headerShown: false,
          tabBarIcon:()=>{
            return(
              <>
              <Entypo name="home" size={24} color="black" />
              </>
            )
          }
         }}
        name="HomeTab"
         component={HomeScreen}
         />
      <Tab.Screen
      options={{
        header:()=><Header page='favorite'/>,
        tabBarIcon:()=>{
          return(
            <>
            <MaterialIcons name="favorite" size={24} color="black" />
            </>
          )
        }
      }}
      name="Favorite List" component={FavoritesListScreen} />
    </Tab.Navigator>
  );
}
