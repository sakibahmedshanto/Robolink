import { atom, useAtom } from 'jotai'

// Data To Send
const DTSAtom = atom<{[key: string]: any}>({})
const mediumAtom = atom<'bt' | 'udp'>('bt')

export const useDTS = () => useAtom(DTSAtom)
export const useMedium = () => useAtom(mediumAtom)
