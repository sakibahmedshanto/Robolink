/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createStaticNavigation, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GamepadInputScreen from './src/screens/GamepadInputScreen';
import HeaderRightButtons from './src/components/HeaderRightButtons';
import { useBluetoothStatus } from './src/atoms/configs';
import { BluetoothSerial } from "./src/specs";
import { useEffect, useState } from 'react';
import { showToast } from './src/components/toast';


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
    headerRight: () => <HeaderRightButtons />
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
  const [ _, setBluetoothStatus ] = useBluetoothStatus();

  useEffect(() => {  
    setBluetoothStatus({
      isEnabled: BluetoothSerial.isEnabled(),
      isConnected: BluetoothSerial.isConnected(),
    });
  }, []);

  useEffect(() => {
    BluetoothSerial.on('bluetoothEnabled', (data:any) => {
      setBluetoothStatus((prev:any) => ({
        ...prev,
        isEnabled: true,
      }));
    });
    
    BluetoothSerial.on('bluetoothDisabled', (data:any) => {
      setBluetoothStatus((prev:any) => ({
        ...prev,
        isEnabled: false,
      }));
    });

    BluetoothSerial.on('connectionSuccess', (data:any) => {
      showToast('Device connected successfully');
      setBluetoothStatus((prev:any) => ({
        ...prev,
        isConnected: true,
      }));
    });
    BluetoothSerial.on('connectionLost', (data:any) => {
      console.log('Device connection lost');
      showToast('Device connection lost');
      setBluetoothStatus((prev:any) => ({
        ...prev,
        isConnected: false,
      }));
    });
    BluetoothSerial.on('connectionFailed', (data:any) => {
      console.log('Device connection failed');
      showToast('Device connection failed');
      setBluetoothStatus((prev:any) => ({
        ...prev,
        isConnected: false,
      }));
    });
    BluetoothSerial.on('error', (error:any) => {
      console.log('Bluetooth Serial Error:', error);
      showToast('Bluetooth Serial Error: ' + error.message);
    });

    return () => {
      BluetoothSerial.removeListener('bluetoothEnabled');
      BluetoothSerial.removeListener('bluetoothDisabled');
      BluetoothSerial.removeListener('connectionSuccess');
      BluetoothSerial.removeListener('connectionLost');
      BluetoothSerial.removeListener('connectionFailed');
      BluetoothSerial.removeListener('error');
    }
  }, [])

  return <Navigation />
}


export default App;
