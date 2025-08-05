/**
 * Data transmission management for Custom Joystick Screen
 * Handles button state and data transmission via Bluetooth/UDP using JSON format
 */

import { useRef, useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { BluetoothSerial } from '../../specs';
import { useBluetoothStatus } from '../../atoms/configs';
import { useUdpSingleton } from '../../hooks/useUdpSingleton';

interface ButtonState {
  [buttonId: string]: number; // 0 for released, 1 for pressed
}

interface JoystickData {
  [key: string]: number;
}

export const useCustomJoystickData = () => {
  const [buttonStates, setButtonStates] = useState<ButtonState>({});
  const [joystickData, setJoystickData] = useState<JoystickData>({});
  const [bluetoothStatus] = useBluetoothStatus();
  const { startTransmission, stopTransmission, sendImmediately } = useUdpSingleton();
  
  console.log('🎮 Custom Joystick Data Hook Initialized', {
    bluetoothStatus: {
      isConnected: bluetoothStatus.isConnected,
      enableSendOverBT: bluetoothStatus.enableSendOverBT,
    }
  });

  const buttonStatesRef = useRef(buttonStates);
  const joystickDataRef = useRef(joystickData);
  const btIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keep refs updated
  useEffect(() => {
    buttonStatesRef.current = buttonStates;
  }, [buttonStates]);

  useEffect(() => {
    joystickDataRef.current = joystickData;
  }, [joystickData]);  // Bluetooth transmission
  useEffect(() => {
    console.log('🔧 Bluetooth transmission effect triggered:', {
      isConnected: bluetoothStatus.isConnected,
      enableSendOverBT: bluetoothStatus.enableSendOverBT,
      intervalDelay: bluetoothStatus.intervalDelay
    });

    if (!bluetoothStatus.isConnected || !bluetoothStatus.enableSendOverBT) {
      if (btIntervalRef.current) clearInterval(btIntervalRef.current);
      console.log('❌ Bluetooth transmission disabled');
      return;
    }

    if (btIntervalRef.current) clearInterval(btIntervalRef.current);    console.log('✅ Starting Bluetooth transmission interval');
    btIntervalRef.current = setInterval(() => {
      // Create simple key-value format - same as main gamepad component
      const gamepadValues: string[] = [];
      
      // Add button states
      Object.keys(buttonStatesRef.current).forEach(key => {
        const value = buttonStatesRef.current[key] || 0;
        if (value !== 0) {
          gamepadValues.push(`${key}=${value}`);
        }
      });
      
      // Add joystick/slider data
      Object.keys(joystickDataRef.current).forEach(key => {
        const value = joystickDataRef.current[key] || 0;
        if (value !== 0) {
          gamepadValues.push(`${key}=${value}`);
        }
      });
      
      const simpleMessage = gamepadValues.join(',');
      console.log('📡 Bluetooth transmission (simple format):', simpleMessage);
      BluetoothSerial.writeToDevice(simpleMessage);
    }, bluetoothStatus.intervalDelay || 100);

    return () => {
      if (btIntervalRef.current) clearInterval(btIntervalRef.current);
    };
  }, [
    bluetoothStatus.isConnected,
    bluetoothStatus.enableSendOverBT,
    bluetoothStatus.intervalDelay,  ]);
  // UDP transmission using singleton
  useEffect(() => {
    console.log('🔧 CustomJoystick - Setting up UDP transmission');
    
    const createDataMessage = (): string => {
      // Create simple key-value format - same as main gamepad component
      const gamepadValues: string[] = [];
      
      // Add button states
      Object.keys(buttonStatesRef.current).forEach(key => {
        const value = buttonStatesRef.current[key] || 0;
        if (value !== 0) {
          gamepadValues.push(`${key}=${value}`);
        }
      });
      
      // Add joystick/slider data
      Object.keys(joystickDataRef.current).forEach(key => {
        const value = joystickDataRef.current[key] || 0;
        if (value !== 0) {
          gamepadValues.push(`${key}=${value}`);
        }
      });
      
      return gamepadValues.join(',');
    };

    // Start UDP transmission with the data callback
    startTransmission(createDataMessage);

    return () => {
      console.log('🔧 CustomJoystick - Cleaning up UDP transmission');
      stopTransmission();
    };
  }, []); // Empty dependency array - we only want to set this up once
  // Button press handlers with immediate transmission
  const handleButtonPress = (buttonId: string, pressed: boolean) => {
    const value = pressed ? 1 : 0;
    console.log(`🎮 Custom Joystick Button ${buttonId}: ${pressed ? 'PRESSED' : 'RELEASED'} (Value: ${value})`);
    setButtonStates(prev => ({
      ...prev,
      [buttonId]: value
    }));

    // Send immediately for real-time control
    const immediateData = `${buttonId}=${value}`;
    sendImmediately(immediateData);
    console.log(`⚡ Immediate button data sent: ${immediateData}`);
  };

  // Joystick movement handlers with smart transmission
  const handleJoystickMove = (joystickId: string, x: number, y: number) => {
    console.log(`🕹️ Custom Joystick ${joystickId}: X=${x}, Y=${y}`);
    
    const scaledX = Math.round(x * 1000); // Scale to match physical gamepad format (-1000 to 1000)
    const scaledY = Math.round(y * 1000);
    
    setJoystickData(prev => ({
      ...prev,
      [`${joystickId}_x`]: scaledX,
      [`${joystickId}_y`]: scaledY
    }));

    // For joysticks, only send immediately if it's a significant change
    const prevX = joystickDataRef.current[`${joystickId}_x`] || 0;
    const prevY = joystickDataRef.current[`${joystickId}_y`] || 0;
    
    const deltaX = Math.abs(scaledX - prevX);
    const deltaY = Math.abs(scaledY - prevY);
      // Send immediately if significant movement (threshold of 100 = 0.1 in normalized coords)
    if (deltaX > 100 || deltaY > 100) {
      const immediateData = `${joystickId}_x=${scaledX},${joystickId}_y=${scaledY}`;
      sendImmediately(immediateData);
      console.log(`⚡ Immediate joystick data sent: ${immediateData}`);
    }
  };
  // Slider value handlers with immediate transmission
  const handleSliderChange = (sliderId: string, value: number) => {
    const scaledValue = Math.round(value * 10); // Scale 0-100 to 0-1000
    console.log(`🎚️ Custom Slider ${sliderId}: ${value} → ${scaledValue}`);
    
    setJoystickData(prev => ({
      ...prev,
      [sliderId]: scaledValue
    }));

    // Send immediately for real-time control
    const immediateData = `${sliderId}=${scaledValue}`;
    sendImmediately(immediateData);
    console.log(`⚡ Immediate slider data sent: ${immediateData}`);
  };

  // Format message function for debugging and display
  const formatMessage = (data: any) => {
    // Create simple key-value format for debugging
    const values: string[] = [];
    
    Object.keys(data).forEach(key => {
      const value = data[key] || 0;
      // Only include non-zero values to reduce clutter
      if (value !== 0) {
        values.push(`${key}=${value}`);
      }
    });
    
    return values.join(',') || 'No active inputs';
  };

  return {
    buttonStates,
    joystickData,
    handleButtonPress,
    handleJoystickMove,
    handleSliderChange,
    formatMessage,
  };
};
