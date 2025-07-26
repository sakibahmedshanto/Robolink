/**
 * Data transmission management for Custom Joystick Screen
 * Handles button state and data transmission via Bluetooth/UDP
 */

import { useRef, useEffect, useState } from 'react';
import { BluetoothSerial } from '../../specs';
import { useBluetoothStatus, useUdpStatus } from '../../atoms/configs';
import { broadcastUdpData, useUdpSocket } from '../../atoms/udp';

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
  const [udpStatus] = useUdpStatus();
  const { socket: udpSocket } = useUdpSocket();
  
  console.log('🎮 Custom Joystick Data Hook Initialized', {
    bluetoothStatus: {
      isConnected: bluetoothStatus.isConnected,
      enableSendOverBT: bluetoothStatus.enableSendOverBT,
    },
    udpStatus: {
      enableSendOverUdp: udpStatus.enableSendOverUdp,
      port: udpStatus.port,
    }
  });

  const buttonStatesRef = useRef(buttonStates);
  const joystickDataRef = useRef(joystickData);
  const btIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const udpIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keep refs updated
  useEffect(() => {
    buttonStatesRef.current = buttonStates;
  }, [buttonStates]);

  useEffect(() => {
    joystickDataRef.current = joystickData;
  }, [joystickData]);
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
      const allData = { ...buttonStatesRef.current, ...joystickDataRef.current };
      const message = formatMessage(allData);
      console.log('📡 Bluetooth transmission:', message);
      BluetoothSerial.writeToDevice(btoa(message));
    }, bluetoothStatus.intervalDelay || 100);

    return () => {
      if (btIntervalRef.current) clearInterval(btIntervalRef.current);
    };
  }, [
    bluetoothStatus.isConnected,
    bluetoothStatus.enableSendOverBT,
    bluetoothStatus.intervalDelay,
  ]);
  // UDP transmission
  useEffect(() => {
    console.log('🔧 UDP transmission effect triggered:', {
      enableSendOverUdp: udpStatus.enableSendOverUdp,
      intervalDelay: udpStatus.intervalDelay,
      port: udpStatus.port
    });

    if (!udpStatus.enableSendOverUdp) {
      if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);
      console.log('❌ UDP transmission disabled');
      return;
    }

    if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);

    console.log('✅ Starting UDP transmission interval');
    udpIntervalRef.current = setInterval(() => {
      if (!udpStatus.enableSendOverUdp) {
        if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);
        return;
      }
      
      const allData = { ...buttonStatesRef.current, ...joystickDataRef.current };
      const message = formatMessage(allData);
      console.log('📡 UDP transmission:', message);
      if (udpSocket) broadcastUdpData(udpSocket, message, udpStatus.port);
      else console.warn('UDP socket not available');
    }, udpStatus.intervalDelay || 100);

    return () => {
      if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);
    };
  }, [udpStatus.enableSendOverUdp, udpStatus.intervalDelay, udpStatus.port]);

  // Format message in the same format as GamepadInputs
  const formatMessage = (data: JoystickData): string => {
    const keys = Object.keys(data);
    let result = `<${keys.length} `;
    keys.forEach(key => {
      result += `${data[key] || 0} `;
    });
    result += '>';
    return result;
  };

  // Button press handlers
  const handleButtonPress = (buttonId: string, pressed: boolean) => {
    const value = pressed ? 1 : 0;
    console.log(`🎮 Custom Joystick Button ${buttonId}: ${pressed ? 'PRESSED' : 'RELEASED'} (Value: ${value})`);
    setButtonStates(prev => ({
      ...prev,
      [buttonId]: value
    }));
  };

  // Joystick movement handlers
  const handleJoystickMove = (joystickId: string, x: number, y: number) => {
    console.log(`🕹️ Custom Joystick ${joystickId}: X=${x}, Y=${y}`);
    setJoystickData(prev => ({
      ...prev,
      [`${joystickId}_x`]: Math.round(x * 1000), // Scale to match physical gamepad format (-1000 to 1000)
      [`${joystickId}_y`]: Math.round(y * 1000)
    }));
  };

  // Slider value handlers
  const handleSliderChange = (sliderId: string, value: number) => {
    console.log(`🎚️ Custom Slider ${sliderId}: ${value}`);
    setJoystickData(prev => ({
      ...prev,
      [sliderId]: Math.round(value * 10) // Scale 0-100 to 0-1000
    }));
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
