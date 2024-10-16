import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Thêm import này

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailScreen from '@/components/Detail';
import FavoritesListScreen from '@/components/FavoritesListScreen';
import HomeScreen from '@/components/HomeScreen';
import Header from '@/components/AppHeader';
import SearchScreen from '@/components/SearchScreen';
import SearchScreenHeader from '@/components/SearchScreenHeader';
import TabLayout from '../../components/Bottom-Tabs';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen options={{ header: () => <Header page="home" /> }} name="Home" component={HomeScreen} />
        <Stack.Screen options={{ header: () => <Header page="detail" /> }} name="Detail" component={DetailScreen} />
        <Stack.Screen name="Bottom-Tab" component={TabLayout} />
        <Stack.Screen options={{ headerShown: false }} name="SearchScreen" component={SearchScreen} />
        <Stack.Screen options={{ header: () => <Header page='favorite' /> }} name="Favorite-List" component={FavoritesListScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
