import { Buffer } from 'buffer';
import {atom, useAtom} from 'jotai';
import { useEffect } from 'react';
import UdpSockets from 'react-native-udp';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';
import { useUdpStatus } from './configs';

// Simplified UDP data structure - much easier to use than custom format
interface GamepadData {
  timestamp: number;
  buttons: { [key: string]: number };
  axes: { [key: string]: number };
  deviceInfo?: {
    type: string;
    name: string;
  };
}

export const sendGamepadData = (udpSocket: UdpSocket, gamepadData: GamepadData, port: number) => {
  const targetPort = parseInt(port as any) || 1234;
  
  // Create Arduino/ESP32-friendly key=value format instead of JSON
  const keyValuePairs: string[] = [];
  
  // Add axes data
  Object.entries(gamepadData.axes).forEach(([key, value]) => {
    keyValuePairs.push(`${key}=${value.toFixed(3)}`);
  });
  
  // Add button data
  Object.entries(gamepadData.buttons).forEach(([key, value]) => {
    keyValuePairs.push(`${key}=${value}`);
  });
  
  // Add timestamp
  keyValuePairs.push(`T=${Date.now()}`);
  
  // Create final message: "LX=0.500,RY=-0.800,A=1,B=0,T=1234567890"
  const message = keyValuePairs.join(',');
  const buffer = Buffer.from(message, 'utf8');
  
  try {
    // Check if socket is ready before sending
    if (!udpSocket || typeof udpSocket.send !== 'function') {
      console.warn('UDP socket not ready, skipping send');
      return;
    }

    // Send without callback to prevent callback buildup
    udpSocket.send(buffer, 0, buffer.length, targetPort, '255.255.255.255');
    
  } catch (error) {
    console.error('UDP transmission error:', error);
  }
};

// Legacy function for backwards compatibility (will be removed)
export const broadcastUdpData = (udpSocket: UdpSocket, data: any, port: number) => {
  console.warn('broadcastUdpData is deprecated. Use sendGamepadData instead.');
  const message = Buffer.from(data);
  const targetPort = parseInt(port as any) || 1234;
  try {
      // Remove callback to prevent callback buildup
      udpSocket.send(message, 0, message.length, targetPort, '255.255.255.255');
  } catch (error) {
    console.log(error);
  }
};

const udpSocketAtom = atom<UdpSocket | null>(null);
// export const useUdpSocket = () => useAtom(udpSocketAtom);


export const useUdpSocket = () => {
  const [socket, setSocket] = useAtom(udpSocketAtom);
  const [udpStatus, _] = useUdpStatus(); // dynamic port from atom

  useEffect(() => {
    // Don't create socket if UDP is disabled
    if (!udpStatus.enableSendOverUdp) {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }

    let currentSocket = socket;

    // Cleanup: Close old socket
    if (currentSocket) {
      currentSocket.close();
      setSocket(null);
    }

    // Create new socket with error handling
    try {
      const newSocket = UdpSockets.createSocket({
        type: 'udp4',
        reusePort: true,
      });

      // Set up error handler before binding
      newSocket.on('error', (err) => {
        console.error('UDP Socket Error:', err);
        setSocket(null);
      });      newSocket.on('listening', () => {
        try {
          newSocket.setBroadcast(true);
          console.log(`✅ UDP socket ready on port ${udpStatus.port}`);
          setSocket(newSocket);
        } catch (error) {
          console.error('Error setting broadcast:', error);
        }
      });

      // Bind to port without callback to prevent pending callback warnings
      try {
        newSocket.bind(udpStatus.port);
      } catch (error) {
        console.error('UDP bind error:', error);
        setSocket(null);
      }

    } catch (error) {
      console.error('Error creating UDP socket:', error);
      setSocket(null);
    }

    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
        console.log('UDP socket closed');
      }
    };
  }, [udpStatus.port, udpStatus.enableSendOverUdp]); // rerun whenever port or enable status changes

  return {socket, setSocket};
};
