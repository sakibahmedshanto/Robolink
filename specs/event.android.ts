import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
} from 'react-native'

// const keyDown = '@RNGlobalKeyEvnet_keyDown'

const keyDown = 'onKeyDown'
const keyUp = 'onKeyUp'

const keyEvent = new NativeEventEmitter(NativeModules.RNGlobalKeyEvent)
export const addKeyDownListener = (cb) =>
  keyEvent.addListener(keyDown, (evt) => {
    return cb({ ...evt })
  })

export const addKeyUpListener = (cb) =>
  keyEvent.addListener(keyUp, (evt) => {
    return cb({ ...evt })
  })

export const onJoystickMoveListener = (cb) =>
  DeviceEventEmitter.addListener('onJoystickMove', (evt) => {
    return cb({ ...evt })
  })