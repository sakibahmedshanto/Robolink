/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createStaticNavigation, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GamepadInputScreen from './src/screens/GamepadInputScreen';



const RootStack = createNativeStackNavigator({
  initialRouteName: 'GamepadInputs',
  screenOptions: {
    headerStyle: {
      backgroundColor: '#D72638',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
  screens: {
    GamepadInputs: {
      screen: GamepadInputScreen,
      options: {
        title: 'Gamepad Inputs',
        headerShown: true,
      },
    },
  },
});


const Navigation = createStaticNavigation(RootStack);


function App() {
  return <Navigation />
}


export default App;
