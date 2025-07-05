package com.robolink

import com.facebook.react.ReactActivity
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.WritableMap
import android.view.KeyEvent
import android.view.InputDevice
import android.view.MotionEvent
import android.os.Bundle;

import com.robolink.globalkeyevent.GlobalKeyEventModule

class MainActivity : ReactActivity() {
    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String {
        return "robolink"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
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
}