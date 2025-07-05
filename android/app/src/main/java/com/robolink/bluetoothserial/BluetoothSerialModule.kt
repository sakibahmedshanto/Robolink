package com.robolink.bluetoothserial

import android.app.Activity
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.lang.reflect.Method

@Suppress("unused")
class BluetoothSerialModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext), ActivityEventListener, LifecycleEventListener {

    companion object {
        // Debugging
        private const val D = true

        // Event names
        private const val BT_ENABLED = "bluetoothEnabled"
        private const val BT_DISABLED = "bluetoothDisabled"
        private const val CONN_SUCCESS = "connectionSuccess"
        private const val CONN_FAILED = "connectionFailed"
        private const val CONN_LOST = "connectionLost"
        private const val DEVICE_READ = "read"
        private const val ERROR = "error"

        // Request codes
        private const val REQUEST_ENABLE_BLUETOOTH = 1
        private const val REQUEST_PAIR_DEVICE = 2

        private const val TAG = "BluetoothSerial"
    }

    // Members
    private var mBluetoothAdapter: BluetoothAdapter? = null
    private var mBluetoothService: BluetoothSerialService? = null
    private val mReactContext: ReactApplicationContext = reactContext
    private val mBuffer = StringBuffer()

    // Promises
    private var mEnabledPromise: Promise? = null
    private var mConnectedPromise: Promise? = null
    private var mDeviceDiscoveryPromise: Promise? = null
    private var mPairDevicePromise: Promise? = null
    private var delimiter = ""

    init {
        if (D) Log.d(TAG, "Bluetooth module started")

        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter()
        mBluetoothService = BluetoothSerialService(this)

        if (mBluetoothAdapter?.isEnabled == true) {
            sendEvent(BT_ENABLED, null)
        } else {
            sendEvent(BT_DISABLED, null)
        }

        mReactContext.addActivityEventListener(this)
        mReactContext.addLifecycleEventListener(this)
        registerBluetoothStateReceiver()
    }

    override fun getName(): String = "BluetoothSerial"

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, intent: Intent?) {
        if (D) Log.d(TAG, "On activity result request: $requestCode, result: $resultCode")
        
        when (requestCode) {
            REQUEST_ENABLE_BLUETOOTH -> {
                if (resultCode == Activity.RESULT_OK) {
                    if (D) Log.d(TAG, "User enabled Bluetooth")
                    mEnabledPromise?.resolve(true)
                } else {
                    if (D) Log.d(TAG, "User did *NOT* enable Bluetooth")
                    mEnabledPromise?.reject(Exception("User did not enable Bluetooth"))
                }
                mEnabledPromise = null
            }
            REQUEST_PAIR_DEVICE -> {
                if (resultCode == Activity.RESULT_OK) {
                    if (D) Log.d(TAG, "Pairing ok")
                } else {
                    if (D) Log.d(TAG, "Pairing failed")
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        if (D) Log.d(TAG, "On new intent")
    }

    override fun onHostResume() {
        if (D) Log.d(TAG, "Host resume")
    }

    override fun onHostPause() {
        if (D) Log.d(TAG, "Host pause")
    }

    override fun onHostDestroy() {
        if (D) Log.d(TAG, "Host destroy")
        mBluetoothService?.stop()
    }

    override fun onCatalystInstanceDestroy() {
        if (D) Log.d(TAG, "Catalyst instance destroyed")
        super.onCatalystInstanceDestroy()
        mBluetoothService?.stop()
    }

    /*******************************/
    /** Methods Available from JS **/
    /*******************************/

    /*************************************/
    /** Bluetooth state related methods **/

    @ReactMethod
    fun requestEnable(promise: Promise) {
        // If bluetooth is already enabled resolve promise immediately
        if (mBluetoothAdapter?.isEnabled == true) {
            promise.resolve(true)
        } else {
            // Start new intent if bluetooth is not enabled
            val activity = currentActivity
            mEnabledPromise = promise
            val intent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
            if (activity != null) {
                activity.startActivityForResult(intent, REQUEST_ENABLE_BLUETOOTH)
            } else {
                val e = Exception("Cannot start activity")
                Log.e(TAG, "Cannot start activity", e)
                mEnabledPromise?.reject(e)
                mEnabledPromise = null
                onError(e)
            }
        }
    }

    @ReactMethod
    fun enable(promise: Promise) {
        if (mBluetoothAdapter?.isEnabled == false) {
            mBluetoothAdapter?.enable()
        }
        promise.resolve(true)
    }

    @ReactMethod
    fun disable(promise: Promise) {
        if (mBluetoothAdapter?.isEnabled == true) {
            mBluetoothAdapter?.disable()
        }
        promise.resolve(true)
    }

    @ReactMethod
    fun isEnabled(promise: Promise) {
        promise.resolve(mBluetoothAdapter?.isEnabled ?: false)
    }

    @ReactMethod
    fun withDelimiter(delimiter: String, promise: Promise) {
        this.delimiter = delimiter
        promise.resolve(true)
    }

    /**************************************/
    /** Bluetooth device related methods **/

    @ReactMethod
    fun list(promise: Promise) {
        val deviceList = Arguments.createArray()
        mBluetoothAdapter?.let { adapter ->
            val bondedDevices = adapter.bondedDevices
            for (rawDevice in bondedDevices) {
                val device = deviceToWritableMap(rawDevice)
                deviceList.pushMap(device)
            }
        }
        promise.resolve(deviceList)
    }

    @ReactMethod
    fun discoverUnpairedDevices(promise: Promise) {
        if (D) Log.d(TAG, "Discover unpaired called")

        mDeviceDiscoveryPromise = promise
        registerBluetoothDeviceDiscoveryReceiver()

        if (mBluetoothAdapter != null) {
            mBluetoothAdapter?.startDiscovery()
        } else {
            promise.resolve(Arguments.createArray())
        }
    }

    @ReactMethod
    fun cancelDiscovery(promise: Promise) {
        if (D) Log.d(TAG, "Cancel discovery called")

        mBluetoothAdapter?.let { adapter ->
            if (adapter.isDiscovering) {
                adapter.cancelDiscovery()
            }
        }
        promise.resolve(true)
    }

    @ReactMethod
    fun pairDevice(id: String, promise: Promise) {
        if (D) Log.d(TAG, "Pair device: $id")

        mBluetoothAdapter?.let { adapter ->
            mPairDevicePromise = promise
            val device = adapter.getRemoteDevice(id)
            if (device != null) {
                pairDevice(device)
            } else {
                mPairDevicePromise?.reject(Exception("Could not pair device $id"))
                mPairDevicePromise = null
            }
        } ?: promise.resolve(false)
    }

    @ReactMethod
    fun unpairDevice(id: String, promise: Promise) {
        if (D) Log.d(TAG, "Unpair device: $id")

        mBluetoothAdapter?.let { adapter ->
            mPairDevicePromise = promise
            val device = adapter.getRemoteDevice(id)
            if (device != null) {
                unpairDevice(device)
            } else {
                mPairDevicePromise?.reject(Exception("Could not unpair device $id"))
                mPairDevicePromise = null
            }
        } ?: promise.resolve(false)
    }

    /********************************/
    /** Connection related methods **/

    @ReactMethod
    fun connect(id: String, promise: Promise) {
        mConnectedPromise = promise
        mBluetoothAdapter?.let { adapter ->
            val device = adapter.getRemoteDevice(id)
            if (device != null) {
                mBluetoothService?.connect(device)
            } else {
                promise.reject(Exception("Could not connect to $id"))
            }
        } ?: promise.resolve(true)
    }

    @ReactMethod
    fun disconnect(promise: Promise) {
        mBluetoothService?.stop()
        promise.resolve(true)
    }

    @ReactMethod
    fun isConnected(promise: Promise) {
        promise.resolve(mBluetoothService?.isConnected() ?: false)
    }

    /*********************/
    /** Write to device **/

    @ReactMethod
    fun writeToDevice(message: String, promise: Promise) {
        if (D) Log.d(TAG, "Write $message")
        val data = Base64.decode(message, Base64.DEFAULT)
        mBluetoothService?.write(data)
        promise.resolve(true)
    }

    /**********************/
    /** Read from device **/

    @ReactMethod
    fun readFromDevice(promise: Promise) {
        if (D) Log.d(TAG, "Read")
        val length = mBuffer.length
        val data = mBuffer.substring(0, length)
        mBuffer.delete(0, length)
        promise.resolve(data)
    }

    @ReactMethod
    fun readUntilDelimiter(delimiter: String, promise: Promise) {
        promise.resolve(readUntil(delimiter))
    }

    /***********/
    /** Other **/

    @ReactMethod
    fun clear(promise: Promise) {
        mBuffer.setLength(0)
        promise.resolve(true)
    }

    @ReactMethod
    fun available(promise: Promise) {
        promise.resolve(mBuffer.length)
    }

    @ReactMethod
    fun setAdapterName(newName: String, promise: Promise) {
        mBluetoothAdapter?.name = newName
        promise.resolve(true)
    }

    /****************************************/
    /** Methods available to whole package **/
    /****************************************/

    fun onConnectionSuccess(msg: String) {
        val params = Arguments.createMap().apply {
            putString("message", msg)
        }
        sendEvent(CONN_SUCCESS, null)
        mConnectedPromise?.resolve(params)
        mConnectedPromise = null
    }

    fun onConnectionFailed(msg: String) {
        val params = Arguments.createMap().apply {
            putString("message", msg)
        }
        sendEvent(CONN_FAILED, null)
        mConnectedPromise?.reject(Exception(msg))
        mConnectedPromise = null
    }

    fun onConnectionLost(msg: String) {
        val params = Arguments.createMap().apply {
            putString("message", msg)
        }
        sendEvent(CONN_LOST, params)
    }

    fun onError(e: Exception) {
        val params = Arguments.createMap().apply {
            putString("message", e.message)
        }
        sendEvent(ERROR, params)
    }

    fun onData(data: String) {
        mBuffer.append(data)
        val completeData = readUntil(delimiter)
        if (completeData.isNotEmpty()) {
            val params = Arguments.createMap().apply {
                putString("data", completeData)
            }
            sendEvent(DEVICE_READ, params)
        }
    }

    private fun readUntil(delimiter: String): String {
        var data = ""
        val index = mBuffer.indexOf(delimiter, 0)
        if (index > -1) {
            data = mBuffer.substring(0, index + delimiter.length)
            mBuffer.delete(0, index + delimiter.length)
        }
        return data
    }

    /*********************/
    /** Private methods **/
    /*********************/

    private fun isKitKatOrAbove(): Boolean {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        if (mReactContext.hasActiveCatalystInstance()) {
            if (D) Log.d(TAG, "Sending event: $eventName")
            mReactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        }
    }

    private fun deviceToWritableMap(device: BluetoothDevice): WritableMap {
        if (D) Log.d(TAG, "device$device")

        return Arguments.createMap().apply {
            putString("name", device.name)
            putString("address", device.address)
            putString("id", device.address)
            device.bluetoothClass?.let {
                putInt("class", it.deviceClass)
            }
        }
    }

    private fun pairDevice(device: BluetoothDevice) {
        try {
            if (D) Log.d(TAG, "Start Pairing...")
            val m: Method = device.javaClass.getMethod("createBond", *arrayOfNulls<Class<*>>(0))
            m.invoke(device, *arrayOfNulls<Any>(0))
            registerDevicePairingReceiver(device.address, BluetoothDevice.BOND_BONDED)
            if (D) Log.d(TAG, "Pairing finished.")
        } catch (e: Exception) {
            Log.e(TAG, "Cannot pair device", e)
            mPairDevicePromise?.reject(e)
            mPairDevicePromise = null
            onError(e)
        }
    }

    private fun unpairDevice(device: BluetoothDevice) {
        try {
            if (D) Log.d(TAG, "Start Unpairing...")
            val m: Method = device.javaClass.getMethod("removeBond", *arrayOfNulls<Class<*>>(0))
            m.invoke(device, *arrayOfNulls<Any>(0))
            registerDevicePairingReceiver(device.address, BluetoothDevice.BOND_NONE)
        } catch (e: Exception) {
            Log.e(TAG, "Cannot unpair device", e)
            mPairDevicePromise?.reject(e)
            mPairDevicePromise = null
            onError(e)
        }
    }

    private fun registerDevicePairingReceiver(deviceId: String, requiredState: Int) {
        val intentFilter = IntentFilter().apply {
            addAction(BluetoothDevice.ACTION_BOND_STATE_CHANGED)
        }

        val devicePairingReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                val action = intent.action

                if (BluetoothDevice.ACTION_BOND_STATE_CHANGED == action) {
                    val state = intent.getIntExtra(BluetoothDevice.EXTRA_BOND_STATE, BluetoothDevice.ERROR)
                    val prevState = intent.getIntExtra(BluetoothDevice.EXTRA_PREVIOUS_BOND_STATE, BluetoothDevice.ERROR)

                    when {
                        state == BluetoothDevice.BOND_BONDED && prevState == BluetoothDevice.BOND_BONDING -> {
                            if (D) Log.d(TAG, "Device paired")
                            mPairDevicePromise?.resolve(true)
                            mPairDevicePromise = null
                            try {
                                mReactContext.unregisterReceiver(this)
                            } catch (e: Exception) {
                                Log.e(TAG, "Cannot unregister receiver", e)
                                onError(e)
                            }
                        }
                        state == BluetoothDevice.BOND_NONE && prevState == BluetoothDevice.BOND_BONDED -> {
                            if (D) Log.d(TAG, "Device unpaired")
                            mPairDevicePromise?.resolve(true)
                            mPairDevicePromise = null
                            try {
                                mReactContext.unregisterReceiver(this)
                            } catch (e: Exception) {
                                Log.e(TAG, "Cannot unregister receiver", e)
                                onError(e)
                            }
                        }
                    }
                }
            }
        }

        mReactContext.registerReceiver(devicePairingReceiver, intentFilter)
    }

    private fun registerBluetoothDeviceDiscoveryReceiver() {
        val intentFilter = IntentFilter().apply {
            addAction(BluetoothDevice.ACTION_FOUND)
            addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED)
        }

        val deviceDiscoveryReceiver = object : BroadcastReceiver() {
            private val unpairedDevices = Arguments.createArray()

            override fun onReceive(context: Context, intent: Intent) {
                val action = intent.action
                if (D) Log.d(TAG, "onReceive called")

                when (action) {
                    BluetoothDevice.ACTION_FOUND -> {
                        val device = intent.getParcelableExtra<BluetoothDevice>(BluetoothDevice.EXTRA_DEVICE)
                        device?.let {
                            val d = deviceToWritableMap(it)
                            unpairedDevices.pushMap(d)
                        }
                    }
                    BluetoothAdapter.ACTION_DISCOVERY_FINISHED -> {
                        if (D) Log.d(TAG, "Discovery finished")
                        mDeviceDiscoveryPromise?.resolve(unpairedDevices)
                        mDeviceDiscoveryPromise = null

                        try {
                            mReactContext.unregisterReceiver(this)
                        } catch (e: Exception) {
                            Log.e(TAG, "Unable to unregister receiver", e)
                            onError(e)
                        }
                    }
                }
            }
        }

        mReactContext.registerReceiver(deviceDiscoveryReceiver, intentFilter)
    }

    private fun registerBluetoothStateReceiver() {
        val intentFilter = IntentFilter().apply {
            addAction(BluetoothAdapter.ACTION_STATE_CHANGED)
        }

        val bluetoothStateReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                val action = intent.action

                if (BluetoothAdapter.ACTION_STATE_CHANGED == action) {
                    val state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR)
                    when (state) {
                        BluetoothAdapter.STATE_OFF -> {
                            if (D) Log.d(TAG, "Bluetooth was disabled")
                            sendEvent(BT_DISABLED, null)
                        }
                        BluetoothAdapter.STATE_ON -> {
                            if (D) Log.d(TAG, "Bluetooth was enabled")
                            sendEvent(BT_ENABLED, null)
                        }
                    }
                }
            }
        }

        mReactContext.registerReceiver(bluetoothStateReceiver, intentFilter)
    }
}