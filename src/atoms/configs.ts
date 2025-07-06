import { atom, useAtom } from 'jotai'

// Data To Send
const DTSAtom = atom<{[key: string]: any}>({})
const mediumAtom = atom<'bt' | 'udp'>('bt')
const bluetoothStatusAtom = atom<any>({
    enableSendOverBT: true,
    isEnabled: false,
    isConnected: false,
    deviceName: '',
    deviceAddress: '',
})

export const useDTS = () => useAtom(DTSAtom)
export const useMedium = () => useAtom(mediumAtom)
export const useBluetoothStatus = () => useAtom(bluetoothStatusAtom)
