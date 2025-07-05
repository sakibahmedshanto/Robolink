package com.robolink.globalkeyevent

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.view.KeyEvent
import android.view.MotionEvent
import android.view.InputDevice
import android.util.Log

class GlobalKeyEventModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val REACT_CLASS = "RNGlobalKeyEvent"

        @Volatile private var instance: GlobalKeyEventModule? = null

        @Synchronized
        fun getInstance(): GlobalKeyEventModule? {
            return instance
        }
    }

    private val mReactContext: ReactContext = reactContext
    private var mJSModule: DeviceEventManagerModule.RCTDeviceEventEmitter? = null

    init {
        instance = this
    }

    @Synchronized
    fun onKeyDownEvent(keyCode: Int, keyEvent: KeyEvent) {
        if (!mReactContext.hasActiveCatalystInstance()) return

        try {
            val gamepadState = WritableNativeMap()
            Log.d(REACT_CLASS, "onKeyDownEvent: $keyCode - Source: ${keyEvent.source}")
            updateGamepadState(gamepadState, keyCode, 1)
            getJSModule()?.emit("onKeyDown", gamepadState)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @Synchronized
    fun onKeyUpEvent(keyCode: Int, keyEvent: KeyEvent) {
        if (!mReactContext.hasActiveCatalystInstance()) return

        try {
            val gamepadState = WritableNativeMap()
            updateGamepadState(gamepadState, keyCode, 0)
            getJSModule()?.emit("onKeyUp", gamepadState)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @Synchronized
    fun onMotionEvent(event: MotionEvent) {
        if (!mReactContext.hasActiveCatalystInstance()) return
        // Log.d(REACT_CLASS, "Joystick: ${InputDevice.SOURCE_JOYSTICK} - Source: ${event.source}")
        if (event.source and InputDevice.SOURCE_JOYSTICK == 0) return

        try {
            val gamepadState = WritableNativeMap()
            
            // Thumbsticks
            gamepadState.putInt("leftX", (event.getAxisValue(MotionEvent.AXIS_X) * 1000).toInt())
            gamepadState.putInt("leftY", (event.getAxisValue(MotionEvent.AXIS_Y) * 1000).toInt())
            gamepadState.putInt("rightX", (event.getAxisValue(MotionEvent.AXIS_Z) * 1000).toInt())
            gamepadState.putInt("rightY", (event.getAxisValue(MotionEvent.AXIS_RZ) * 1000).toInt())
            
            // Triggers (values range from 0 to 1.0)
            val leftTrigger = event.getAxisValue(MotionEvent.AXIS_LTRIGGER)
            val rightTrigger = event.getAxisValue(MotionEvent.AXIS_RTRIGGER)
            
            // Some controllers use alternative axes for triggers
            val altLeftTrigger = event.getAxisValue(MotionEvent.AXIS_BRAKE)
            val altRightTrigger = event.getAxisValue(MotionEvent.AXIS_GAS)
            
            // Use whichever value is non-zero
            gamepadState.putInt("leftTrigger", ((leftTrigger.takeIf { it != 0f } ?: altLeftTrigger) * 1000).toInt())
            gamepadState.putInt("rightTrigger", ((rightTrigger.takeIf { it != 0f } ?: altRightTrigger) * 1000).toInt())

            // Hat switch (D-pad)
            val hatX = event.getAxisValue(MotionEvent.AXIS_HAT_X)
            val hatY = event.getAxisValue(MotionEvent.AXIS_HAT_Y)

            gamepadState.putInt("hatX", (hatX * 1000).toInt())
            gamepadState.putInt("hatY", (hatY * 1000).toInt())
            
            getJSModule()?.emit("onJoystickMove", gamepadState)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @Synchronized
    private fun getJSModule(): DeviceEventManagerModule.RCTDeviceEventEmitter? {
        return mJSModule ?: run {
            mJSModule = mReactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            mJSModule
        }
    }

    @Synchronized
    private fun updateGamepadState(gamepadState: WritableNativeMap, keyCode: Int, value: Int) {
        try {
            gamepadState.putInt(keyCode.toString(), value)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun getName(): String {
        return REACT_CLASS
    }
}