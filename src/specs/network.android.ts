import { NativeModules, NativeEventEmitter } from 'react-native';

const { Network } = NativeModules;
const NetworkEvents = new NativeEventEmitter(Network);

export const getIPAddress = async () => {
    const ip = await Network.getIPAddress();
    console.log(ip)
    return ip;
};

export const subscribeToIPChanges = (callback: (ip: string) => void) => {
  Network.startListening();
  const sub = NetworkEvents.addListener("onIpAddressChange", callback);
  return () => {
    sub.remove();
    Network.stopListening();
  };
};
