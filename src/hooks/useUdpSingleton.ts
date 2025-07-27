/**
 * UDP Singleton Hook
 * React hook that provides access to the singleton UDP manager
 */

import { useEffect, useRef } from 'react';
import { useUdpStatus } from '../atoms/configs';
import UdpManager from '../services/UdpManager';

export const useUdpSingleton = () => {
  const [udpStatus] = useUdpStatus();
  const udpManagerRef = useRef<UdpManager>(UdpManager.getInstance());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentDataCallbackRef = useRef<(() => string) | null>(null);

  // Initialize UDP manager when status changes
  useEffect(() => {
    const config = {
      port: udpStatus.port,
      enabled: udpStatus.enableSendOverUdp,
      intervalDelay: udpStatus.intervalDelay
    };

    console.log('🔧 useUdpSingleton - Config changed:', config);
    udpManagerRef.current.initialize(config);

    // Restart transmission with current data callback if it exists
    if (currentDataCallbackRef.current) {
      console.log('🔧 useUdpSingleton - Restarting transmission with updated config');
      startTransmission(currentDataCallbackRef.current);
    }
  }, [udpStatus.port, udpStatus.enableSendOverUdp, udpStatus.intervalDelay]);  // Start/stop transmission interval based on data
  const startTransmission = (dataCallback: () => string) => {
    console.log('🔧 useUdpSingleton - startTransmission called, UDP enabled:', udpStatus.enableSendOverUdp);
    
    // Store the callback for later use
    currentDataCallbackRef.current = dataCallback;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!udpStatus.enableSendOverUdp) {
      console.log('🔧 useUdpSingleton - UDP disabled, not starting transmission');
      return;
    }

    console.log('🔧 useUdpSingleton - Starting transmission interval with delay:', udpStatus.intervalDelay);
    intervalRef.current = setInterval(() => {
      if (udpManagerRef.current.isReady()) {
        const data = dataCallback();
        if (data) {
          console.log('🔧 useUdpSingleton - Sending data:', data);
          udpManagerRef.current.sendData(data);
        } else {
          console.log('🔧 useUdpSingleton - No data to send');
        }
      } else {
        console.warn('🔧 useUdpSingleton - UDP manager not ready');
      }
    }, udpStatus.intervalDelay || 100);
  };
  const stopTransmission = () => {
    if (intervalRef.current) {
      console.log('🔧 useUdpSingleton - Stopping transmission');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    currentDataCallbackRef.current = null;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTransmission();
    };
  }, []);

  return {
    udpManager: udpManagerRef.current,
    startTransmission,
    stopTransmission,
    isReady: () => udpManagerRef.current.isReady(),
    sendData: (data: string) => udpManagerRef.current.sendData(data)
  };
};
