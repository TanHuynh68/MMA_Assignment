import { StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Root from '@/components/Root';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailScreen from '@/components/Detail';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator>
        <Stack.Screen name="Root"
        options={{headerShown: false}}
        component={Root} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
