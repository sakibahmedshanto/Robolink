/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createStaticNavigation, useNavigation, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GamepadInputScreen from './src/screens/GamepadInputScreen';
import CustomControllerScreen from './src/screens/CustomControllerScreen';
import CustomJoystickScreen from './src/screens/CustomJoystickScreen';
import HeaderRightButtons from './src/components/HeaderRightButtons';
import { useBluetoothStatus, useUdpStatus } from './src/atoms/configs';
import { BluetoothSerial } from "./src/specs";
import { useEffect } from 'react';
import { showToast } from './src/components/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UdpManager from './src/services/UdpManager';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import { BackHandler } from 'react-native';
import { primaryColor } from './src/const/theme';


const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    headerStyle: {
      backgroundColor: primaryColor,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: () => <HeaderRightButtons />
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Home',
        headerShown: false,
      },
    },
    Login: {
      screen: LoginScreen,
      options: {
        title: 'Login',
        headerShown: false,
      },
    },
    GamepadInputs: {
      screen: GamepadInputScreen,
      options: {
        title: 'Gamepad Inputs',
        headerShown: true,
      },
    },
    CustomController: {
      screen: CustomControllerScreen,
      options: {
        title: 'Custom Controller',
        headerShown: false,
      },
    },
  },
});


const Navigation = createStaticNavigation(RootStack);


function App() {
  const [ _, setBluetoothStatus ] = useBluetoothStatus();
  const [ __, setUdpStatus] = useUdpStatus();
  // const navigation = useNavigation();
  
  // useEffect(() => {
  //     const backAction = () => {
  //     // This is the action to perform when the back button is pressed.
  //     // We'll use the navigation.goBack() function to navigate back.
  //     // Returning true from the event handler prevents the default action (app exit).
  //     navigation.goBack();
  //     return true;
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );
  //   // This cleanup function is crucial. It removes the event listener
  //   // when the component is unmounted to prevent memory leaks.
  //   return () => backHandler.remove();
  // }, [navigation]); // The dependency array ensures the effect runs only once or when 'navigation' changes.

  
  useEffect(() => {
    initializeBluetoothStatus();
    initializeUdpStatus();

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
    let enableBtTransmission: string | null = null;
    let intervalDelay = 100; // Default value
    try {
      enableBtTransmission = await AsyncStorage.getItem('enableBtTransmission');
      console.log('enableBtTransmission', enableBtTransmission);
      intervalDelay = parseInt(await AsyncStorage.getItem('btIntervalDelay') || '100');
    } catch (error) {
      console.error('Error loading Bluetooth status from storage:', error);
    }
    const isEnabled = await BluetoothSerial.isEnabled();
    const isConnected = await BluetoothSerial.isConnected();    setBluetoothStatus((prev:any) => ({
      ...prev,
      intervalDelay: intervalDelay,
      enableSendOverBT: enableBtTransmission == null ? true : enableBtTransmission === 'true',
      isEnabled,
      isConnected,
    }));
  }

  const initializeUdpStatus = async () => {
    let enableUdpTransmission = true; // Default to true
    let udpIntervalDelay = 100; // Default value
    try {
      const storedUdpSetting = await AsyncStorage.getItem('enableUdpTransmission');
      enableUdpTransmission = storedUdpSetting === null ? true : storedUdpSetting === 'true';
      udpIntervalDelay = parseInt(await AsyncStorage.getItem('udpIntervalDelay') || '100');
      const port = parseInt(await AsyncStorage.getItem('port') || '1234');
      
      setUdpStatus((prev) => ({
        ...prev,
        enableSendOverUdp: enableUdpTransmission,
        intervalDelay: udpIntervalDelay,
        port
      }));

      // Initialize UDP singleton with loaded config
      const udpManager = UdpManager.getInstance();
      await udpManager.initialize({
        port,
        enabled: enableUdpTransmission,
        intervalDelay: udpIntervalDelay
      });
      
    } catch (error) {
      console.error('Error loading UDP status from storage:', error);
    }
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Navigation />
    </GestureHandlerRootView>
  );;
}


export default App;