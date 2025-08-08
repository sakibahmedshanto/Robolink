/**
 * Data transmission management for Custom Joystick Screen
 * Handles button state and data transmission via Bluetooth/UDP using map:value format
 */

import { useRef, useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { BluetoothSerial } from '../../specs';
import { useBluetoothStatus } from '../../atoms/configs';
import { useUdpSingleton } from '../../hooks/useUdpSingleton';

interface ButtonState {
  [mapName: string]: number; // mapName -> mapValue (when pressed) or 0 (when released)
}

interface SliderData {
  [mapName: string]: number; // mapName -> current slider value
}

export const useCustomJoystickData = () => {
  const [buttonStates, setButtonStates] = useState<ButtonState>({});
  const [sliderData, setSliderData] = useState<SliderData>({});
  const [bluetoothStatus] = useBluetoothStatus();
  const { startTransmission, stopTransmission, sendImmediately } = useUdpSingleton();
  
  console.log('🎮 Custom Joystick Data Hook Initialized', {
    bluetoothStatus: {
      isConnected: bluetoothStatus.isConnected,
      enableSendOverBT: bluetoothStatus.enableSendOverBT,
    }
  });

  const buttonStatesRef = useRef(buttonStates);
  const sliderDataRef = useRef(sliderData);
  const btIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keep refs updated
  useEffect(() => {
    buttonStatesRef.current = buttonStates;
  }, [buttonStates]);

  useEffect(() => {
    sliderDataRef.current = sliderData;
  }, [sliderData]);

  // Bluetooth transmission
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

    if (btIntervalRef.current) clearInterval(btIntervalRef.current);

    console.log('✅ Starting Bluetooth transmission interval');
    btIntervalRef.current = setInterval(() => {
      // Create map:value format
      const gamepadValues: string[] = [];
      
      // Add button states (only active ones)
      Object.keys(buttonStatesRef.current).forEach(mapName => {
        const value = buttonStatesRef.current[mapName] || 0;
        if (value !== 0) {
          gamepadValues.push(`${mapName}:${value}`);
        }
      });
      
      // Add slider data (only non-zero values)
      Object.keys(sliderDataRef.current).forEach(mapName => {
        const value = sliderDataRef.current[mapName] || 0;
        if (value !== 0) {
          gamepadValues.push(`${mapName}:${value}`);
        }
      });
      
      const message = gamepadValues.join(',');
      if (message) {
        console.log('📡 Bluetooth transmission (map:value format):', message);
        BluetoothSerial.writeToDevice(message);
      }
    }, bluetoothStatus.intervalDelay || 100);

    return () => {
      if (btIntervalRef.current) clearInterval(btIntervalRef.current);
    };
  }, [
    bluetoothStatus.isConnected,
    bluetoothStatus.enableSendOverBT,
    bluetoothStatus.intervalDelay,
  ]);

  // UDP transmission using singleton
  useEffect(() => {
    console.log('🔧 CustomJoystick - Setting up UDP transmission');
    
    const createDataMessage = (): string => {
      // Create map:value format
      const gamepadValues: string[] = [];
      
      // Add button states (only active ones)
      Object.keys(buttonStatesRef.current).forEach(mapName => {
        const value = buttonStatesRef.current[mapName] || 0;
        if (value !== 0) {
          gamepadValues.push(`${mapName}:${value}`);
        }
      });
      
      // Add slider data (only non-zero values)
      Object.keys(sliderDataRef.current).forEach(mapName => {
        const value = sliderDataRef.current[mapName] || 0;
        if (value !== 0) {
          gamepadValues.push(`${mapName}:${value}`);
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

  // Button press handlers with map:value transmission
  const handleButtonPress = (mapName: string, mapValue: number, pressed: boolean) => {
    const value = pressed ? mapValue : 0;
    console.log(`🎮 Custom Button ${mapName}: ${pressed ? 'PRESSED' : 'RELEASED'} (Value: ${value})`);
    
    setButtonStates(prev => ({
      ...prev,
      [mapName]: value
    }));

    // Send immediately for real-time control
    if (pressed) {
      const immediateData = `${mapName}:${mapValue}`;
      sendImmediately(immediateData);
      console.log(`⚡ Immediate button data sent: ${immediateData}`);
    }
  };

  // Slider value handlers with map:value transmission
  const handleSliderChange = (mapName: string, mapValue: number, sliderValue: number) => {
    // Calculate proportional value: (sliderValue / 100) * mapValue
    const proportionalValue = Math.round((sliderValue / 100) * mapValue);
    console.log(`🎚️ Custom Slider ${mapName}: ${sliderValue}% of ${mapValue} = ${proportionalValue}`);
    
    setSliderData(prev => ({
      ...prev,
      [mapName]: proportionalValue
    }));

    // Send immediately for real-time control
    const immediateData = `${mapName}:${proportionalValue}`;
    sendImmediately(immediateData);
    console.log(`⚡ Immediate slider data sent: ${immediateData}`);
  };

  // Joystick movement handlers (for virtual joysticks) - maintained for compatibility
  const handleJoystickMove = (joystickId: string, x: number, y: number) => {
    console.log(`🕹️ Custom Joystick ${joystickId}: X=${x}, Y=${y}`);
    
    const scaledX = Math.round(x * 1000);
    const scaledY = Math.round(y * 1000);
    
    setSliderData(prev => ({
      ...prev,
      [`${joystickId}_x`]: scaledX,
      [`${joystickId}_y`]: scaledY
    }));

    // Send immediately if significant movement
    const prevX = sliderDataRef.current[`${joystickId}_x`] || 0;
    const prevY = sliderDataRef.current[`${joystickId}_y`] || 0;
    
    const deltaX = Math.abs(scaledX - prevX);
    const deltaY = Math.abs(scaledY - prevY);
    
    if (deltaX > 100 || deltaY > 100) {
      const immediateData = `${joystickId}_x:${scaledX},${joystickId}_y:${scaledY}`;
      sendImmediately(immediateData);
      console.log(`⚡ Immediate joystick data sent: ${immediateData}`);
    }
  };

  // Format message function for debugging and display
  const formatMessage = (data: any) => {
    // Create map:value format for debugging
    const values: string[] = [];
    
    Object.keys(data).forEach(mapName => {
      const value = data[mapName] || 0;
      // Only include non-zero values to reduce clutter
      if (value !== 0) {
        values.push(`${mapName}:${value}`);
      }
    });
    
    return values.join(',') || 'No active inputs';
  };

  return {
    buttonStates,
    joystickData: sliderData, // Renamed for compatibility
    handleButtonPress,
    handleJoystickMove,
    handleSliderChange,
    formatMessage,
  };
};
