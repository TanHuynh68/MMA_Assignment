import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../HomeScreen';
import AppHeader from '../AppHeader';
import FavoritesListScreen from '../FavoritesListScreen';
const Drawer = createDrawerNavigator();
export default function Nav() {
    return (
        <>
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomeScreen} options={{
                title:"Trang chủ",
                header:()=><AppHeader/>
            }}/>
            <Drawer.Screen name="FavoritesList" component={FavoritesListScreen} options={{
                title:"Danh sách yêu thích",
                header:()=><AppHeader/>
            }}/>
        </Drawer.Navigator>
        </>
    );
}