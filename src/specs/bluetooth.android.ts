import ReactNative from 'react-native'
import { Buffer } from 'buffer'
const { NativeModules, DeviceEventEmitter } = ReactNative
const BluetoothSerial = NativeModules.BluetoothSerial

/**
 * Listen for available events
 * @param  {String} eventName Name of event one of connectionSuccess, connectionLost, data, rawData
 * @param  {Function} handler Event handler
 */
BluetoothSerial.on = (eventName:string, handler:(data:any) => void) => {
  DeviceEventEmitter.addListener(eventName, handler)
}

/**
 * Stop listening for event
 * @param  {String} eventName Name of event one of connectionSuccess, connectionLost, data, rawData
 * @param  {Function} handler Event handler
 */
BluetoothSerial.removeListener = (eventName:string) => {
  DeviceEventEmitter.removeAllListeners(eventName)
}

/**
 * Write data to device, you can pass string or buffer,
 * We must convert to base64 in RN there is no way to pass buffer directly
 * @param  {Buffer|String} data
 * @return {Promise<Boolean>}
 */
BluetoothSerial.write = (data:Buffer|string) => {
  if (typeof data === 'string') {
    data = Buffer.from(data)
  }
  return BluetoothSerial.writeToDevice(data.toString('base64'))
}


export default BluetoothSerial