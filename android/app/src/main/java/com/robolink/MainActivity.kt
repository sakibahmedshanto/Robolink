package com.robolink

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.WritableMap
import android.view.KeyEvent
import android.view.InputDevice
import android.view.MotionEvent
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.os.Build

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
        
        // Enable immersive mode to hide navigation bar
        enableImmersiveMode()
    }
    
    private fun enableImmersiveMode() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            // For Android 11 and above
            window.setDecorFitsSystemWindows(false)
            window.insetsController?.let { controller ->
                controller.hide(android.view.WindowInsets.Type.statusBars() or android.view.WindowInsets.Type.navigationBars())
                controller.systemBarsBehavior = android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        } else {
            // For Android 10 and below
            @Suppress("DEPRECATION")
            window.decorView.systemUiVisibility = (
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN
            )
        }
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            enableImmersiveMode()
        }
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return ReactActivityDelegate(this, mainComponentName)
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