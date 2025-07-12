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
import AsyncStorage from '@react-native-async-storage/async-storage';


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
    initializeBluetoothStatus();
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
        isConnected: false,
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

  const initializeBluetoothStatus = async () => {
    let enableBtTransmission = false;
    let intervalDelay = 100; // Default value
    try {
      enableBtTransmission = await AsyncStorage.getItem('enableBtTransmission') == 'false';
      intervalDelay = parseInt(await AsyncStorage.getItem('intervalDelay') || '100');
    } catch (error) {
      console.error('Error loading Bluetooth status from storage:', error);
    }
    const isEnabled = await BluetoothSerial.isEnabled();
    const isConnected = await BluetoothSerial.isConnected();

    setBluetoothStatus((prev:any) => ({
      ...prev,
      intervalDelay: intervalDelay,
      enableSendOverBT: !enableBtTransmission,
      isEnabled,
      isConnected,
    }));
  }

  return <Navigation />
}


export default App;
