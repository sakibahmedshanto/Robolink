import { atom, useAtom } from 'jotai'

type BluetoothStatus = {
    enableSendOverBT: boolean,
    isEnabled: boolean,
    isConnected: boolean,
    deviceName: string,
    deviceAddress: string,
    intervalDelay: number,
}
type UdpStatus = {
    enableSendOverUdp: boolean,
    ipAddress: string | null,
    port: number,
    intervalDelay: number,
}
// Data To Send
const DTSAtom = atom<{[key: string]: any}>({})
const mediumAtom = atom<'bt' | 'udp'>('bt')
const bluetoothStatusAtom = atom<BluetoothStatus>({
    enableSendOverBT: true,
    isEnabled: false,
    isConnected: false,
    deviceName: '',
    deviceAddress: '',
    intervalDelay: 100,
})

const udpStatusAtom = atom<UdpStatus>({
    enableSendOverUdp: true,
    ipAddress: null,
    port: 1234,
    intervalDelay: 500, // Reduce frequency to avoid callback buildup
})


export const useDTS = () => useAtom(DTSAtom)
export const useMedium = () => useAtom(mediumAtom)
export const useBluetoothStatus = () => useAtom(bluetoothStatusAtom)
export const useUdpStatus = () => useAtom(udpStatusAtom)
