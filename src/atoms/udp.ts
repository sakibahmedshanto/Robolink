import { Buffer } from 'buffer';
import {atom, useAtom} from 'jotai';
import { useEffect } from 'react';
import UdpSockets from 'react-native-udp';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';
import { useUdpStatus } from './configs';


export const broadcastUdpData = (udpSocket: UdpSocket, data: any, port:number) => {
  const message = Buffer.from(data);
  const targetPort = parseInt(port as any) || 1234;
  try {
      udpSocket.send(message, 0, message.length, targetPort, '255.255.255.255', (err) => {
          if (err) console.error('UDP send error:', err);
          else console.log('UDP message broadcasted:', data);
      });
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
    let currentSocket = socket;

    // Cleanup: Close old socket
    if (currentSocket) {
      currentSocket.close();
      setSocket(null);
    }

    // Create new socket
    const newSocket = UdpSockets.createSocket({
      type: 'udp4',
      reusePort: true,
    });

    newSocket.bind(udpStatus.port, () => {
      newSocket.setBroadcast(true);
      console.log(`UDP socket bound to port ${udpStatus.port}`);
    });

    newSocket.on('error', (err) => {
      console.error('UDP Socket Error:', err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
      setSocket(null);
      console.log('UDP socket closed');
    };
  }, [udpStatus.port]); // rerun whenever port changes

  return {socket, setSocket};
};
