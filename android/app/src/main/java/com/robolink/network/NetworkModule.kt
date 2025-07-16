package com.robolink.network

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.ConnectivityManager
import android.net.wifi.WifiManager
import android.text.format.Formatter
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.util.Log

class NetworkModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var connectivityReceiver: BroadcastReceiver? = null

    override fun getName(): String = "Network"

    @ReactMethod
    fun getIPAddress(promise: Promise) {
        try {
            val wm = reactContext.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
            val ip = Formatter.formatIpAddress(wm.connectionInfo.ipAddress)
            Log.d("NetworkModule", "IP Address: $ip")
            promise.resolve(ip)
        } catch (e: Exception) {
            promise.reject("ERR_IP", "Failed to get IP address", e)
        }
    }

    @ReactMethod
    fun startListening() {
        val filter = IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION)
        connectivityReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                val wm = reactContext.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
                val ip = Formatter.formatIpAddress(wm.connectionInfo.ipAddress)
                sendEvent("onIpAddressChange", ip)
            }
        }
        reactContext.registerReceiver(connectivityReceiver, filter)
    }

    @ReactMethod
    fun stopListening() {
        connectivityReceiver?.let {
            reactContext.unregisterReceiver(it)
            connectivityReceiver = null
        }
    }

    private fun sendEvent(eventName: String, data: String) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, data)
    }
}