package com.robolink

import com.facebook.react.ReactActivity
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.WritableMap
import android.view.KeyEvent
import android.view.InputDevice
import android.view.MotionEvent

import com.robolink.globalkeyevent.GlobalKeyEventModule

class MainActivity : ReactActivity() {
    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String {
        return "robolink"
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        val instance = GlobalKeyEventModule.getInstance()
        if (event == null) return super.onKeyDown(keyCode, event)
        instance?.onKeyDownEvent(keyCode, event)
        return true
    }

    override fun onKeyUp(keyCode: Int, event: KeyEvent?): Boolean {
        val instance = GlobalKeyEventModule.getInstance()
        if (event == null) return super.onKeyUp(keyCode, event)
        instance?.onKeyUpEvent(keyCode, event)
        return true
    }

    override fun onGenericMotionEvent(event: MotionEvent?): Boolean {
        val instance = GlobalKeyEventModule.getInstance()
        if (event == null) return super.onGenericMotionEvent(event)
        instance?.onMotionEvent(event)
        return true
    }

    // override fun dispatchKeyEvent(event: KeyEvent): Boolean {
    //     val source = event.source

    //     if ((source and InputDevice.SOURCE_GAMEPAD) == InputDevice.SOURCE_GAMEPAD ||
    //         (source and InputDevice.SOURCE_JOYSTICK) == InputDevice.SOURCE_JOYSTICK ||
    //         (source and InputDevice.SOURCE_DPAD) == InputDevice.SOURCE_DPAD) {

    //         val module = GlobalKeyEventModule.getInstance()

    //         when (event.action) {
    //             KeyEvent.ACTION_DOWN -> module?.onKeyDownEvent(event.keyCode, event)
    //             KeyEvent.ACTION_UP -> module?.onKeyUpEvent(event.keyCode, event)
    //         }

    //         // Consume the event so system doesn't react
    //         return true
    //     }

    //     return super.dispatchKeyEvent(event)
    // }
    
    // override fun dispatchGenericMotionEvent(event: MotionEvent): Boolean {
    //     val source = event.source

    //     if ((source and InputDevice.SOURCE_JOYSTICK) == InputDevice.SOURCE_JOYSTICK &&
    //         event.action == MotionEvent.ACTION_MOVE) {

    //         // TODO: Handle joystick analog movement if needed
    //         return true // Consume to block default behavior
    //     }

    //     return super.dispatchGenericMotionEvent(event)
    // }
}