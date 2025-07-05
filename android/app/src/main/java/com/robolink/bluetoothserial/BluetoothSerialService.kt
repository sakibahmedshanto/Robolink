package com.robolink.bluetoothserial

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothSocket
import android.util.Log
import java.io.InputStream
import java.io.OutputStream
import java.util.*

/**
 * This class does all the work for setting up and managing Bluetooth
 * connections with other devices. It has a thread that listens for
 * incoming connections, a thread for connecting with a device, and a
 * thread for performing data transmissions when connected.
 *
 * This code was based on the Android SDK BluetoothChat Sample
 * $ANDROID_SDK/samples/android-17/BluetoothChat
 */
internal class BluetoothSerialService(private val mModule: BluetoothSerialModule) {
    
    companion object {
        // Debugging
        private const val D = true
        
        // UUIDs
        private val UUID_SPP = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")
        
        // Constants that indicate the current connection state
        private const val STATE_NONE = "none"           // we're doing nothing
        private const val STATE_CONNECTING = "connecting" // now initiating an outgoing connection
        private const val STATE_CONNECTED = "connected"   // now connected to a remote device
        private const val TAG = "BluetoothSerial"
    }

    // Member fields
    private val mAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
    private var mConnectThread: ConnectThread? = null
    private var mConnectedThread: ConnectedThread? = null
    private var mState: String = STATE_NONE

    /********************************************/
    /** Methods available within whole package **/
    /********************************************/

    /**
     * Start the ConnectThread to initiate a connection to a remote device.
     * @param device  The BluetoothDevice to connect
     */
    @Synchronized
    fun connect(device: BluetoothDevice) {
        if (D) Log.d(TAG, "connect to: $device")

        if (mState == STATE_CONNECTING) {
            cancelConnectThread() // Cancel any thread attempting to make a connection
        }

        cancelConnectedThread() // Cancel any thread currently running a connection

        // Start the thread to connect with the given device
        mConnectThread = ConnectThread(device)
        mConnectThread?.start()
        setState(STATE_CONNECTING)
    }

    /**
     * Check whether service is connected to device
     * @return Is connected to device
     */
    fun isConnected(): Boolean {
        return getState() == STATE_CONNECTED
    }

    /**
     * Write to the ConnectedThread in an unsynchronized manner
     * @param out The bytes to write
     * @see ConnectedThread.write
     */
    fun write(out: ByteArray) {
        if (D) Log.d(TAG, "Write in service, state is $STATE_CONNECTED")
        
        // Create temporary object
        val r: ConnectedThread?
        
        // Synchronize a copy of the ConnectedThread
        synchronized(this) {
            if (!isConnected()) return
            r = mConnectedThread
        }

        r?.write(out) // Perform the write unsynchronized
    }

    /**
     * Stop all threads
     */
    @Synchronized
    fun stop() {
        if (D) Log.d(TAG, "stop")

        cancelConnectThread()
        cancelConnectedThread()

        setState(STATE_NONE)
    }

    /*********************/
    /** Private methods **/
    /*********************/

    /**
     * Return the current connection state.
     */
    @Synchronized
    private fun getState(): String {
        return mState
    }

    /**
     * Set the current state of connection
     * @param state  A string defining the current connection state
     */
    @Synchronized
    private fun setState(state: String) {
        if (D) Log.d(TAG, "setState() $mState -> $state")
        mState = state
    }

    /**
     * Start the ConnectedThread to begin managing a Bluetooth connection
     * @param socket  The BluetoothSocket on which the connection was made
     * @param device  The BluetoothDevice that has been connected
     */
    @Synchronized
    private fun connectionSuccess(socket: BluetoothSocket, device: BluetoothDevice) {
        if (D) Log.d(TAG, "connected")

        cancelConnectThread() // Cancel any thread attempting to make a connection
        cancelConnectedThread() // Cancel any thread currently running a connection

        // Start the thread to manage the connection and perform transmissions
        mConnectedThread = ConnectedThread(socket)
        mConnectedThread?.start()

        mModule.onConnectionSuccess("Connected to ${device.name}")
        setState(STATE_CONNECTED)
    }

    /**
     * Indicate that the connection attempt failed and notify the UI Activity.
     */
    private fun connectionFailed() {
        mModule.onConnectionFailed("Unable to connect to device") // Send a failure message
        this@BluetoothSerialService.stop() // Start the service over to restart listening mode
    }

    /**
     * Indicate that the connection was lost and notify the UI Activity.
     */
    private fun connectionLost() {
        mModule.onConnectionLost("Device connection was lost") // Send a failure message
        this@BluetoothSerialService.stop() // Start the service over to restart listening mode
    }

    /**
     * Cancel connect thread
     */
    private fun cancelConnectThread() {
        mConnectThread?.let {
            it.cancel()
            mConnectThread = null
        }
    }

    /**
     * Cancel connected thread
     */
    private fun cancelConnectedThread() {
        mConnectedThread?.let {
            it.cancel()
            mConnectedThread = null
        }
    }

    /**
     * This thread runs while attempting to make an outgoing connection
     * with a device. It runs straight through; the connection either
     * succeeds or fails.
     */
    private inner class ConnectThread(private val mmDevice: BluetoothDevice) : Thread() {
        private var mmSocket: BluetoothSocket? = null

        init {
            var tmp: BluetoothSocket? = null

            // Get a BluetoothSocket for a connection with the given BluetoothDevice
            try {
                tmp = mmDevice.createRfcommSocketToServiceRecord(UUID_SPP)
            } catch (e: Exception) {
                mModule.onError(e)
                Log.e(TAG, "Socket create() failed", e)
            }
            mmSocket = tmp
        }

        override fun run() {
            if (D) Log.d(TAG, "BEGIN mConnectThread")
            name = "ConnectThread"

            // Always cancel discovery because it will slow down a connection
            mAdapter?.cancelDiscovery()

            // Make a connection to the BluetoothSocket
            try {
                // This is a blocking call and will only return on a successful connection or an exception
                if (D) Log.d(TAG, "Connecting to socket...")
                mmSocket?.connect()
                if (D) Log.d(TAG, "Connected")
            } catch (e: Exception) {
                Log.e(TAG, e.toString())
                mModule.onError(e)

                // Some 4.1 devices have problems, try an alternative way to connect
                // See https://github.com/don/BluetoothSerialModule/issues/89
                try {
                    Log.i(TAG, "Trying fallback...")
                    val method = mmDevice.javaClass.getMethod("createRfcommSocket", Int::class.javaPrimitiveType)
                    mmSocket = method.invoke(mmDevice, 1) as BluetoothSocket
                    mmSocket?.connect()
                    Log.i(TAG, "Connected")
                } catch (e2: Exception) {
                    Log.e(TAG, "Couldn't establish a Bluetooth connection.")
                    mModule.onError(e2)
                    try {
                        mmSocket?.close()
                    } catch (e3: Exception) {
                        Log.e(TAG, "unable to close() socket during connection failure", e3)
                        mModule.onError(e3)
                    }
                    connectionFailed()
                    return
                }
            }

            // Reset the ConnectThread because we're done
            synchronized(this@BluetoothSerialService) {
                mConnectThread = null
            }

            mmSocket?.let { connectionSuccess(it, mmDevice) } // Start the connected thread
        }

        fun cancel() {
            try {
                mmSocket?.close()
            } catch (e: Exception) {
                Log.e(TAG, "close() of connect socket failed", e)
                mModule.onError(e)
            }
        }
    }

    /**
     * This thread runs during a connection with a remote device.
     * It handles all incoming and outgoing transmissions.
     */
    private inner class ConnectedThread(private val mmSocket: BluetoothSocket) : Thread() {
        private val mmInStream: InputStream?
        private val mmOutStream: OutputStream?

        init {
            if (D) Log.d(TAG, "create ConnectedThread")
            var tmpIn: InputStream? = null
            var tmpOut: OutputStream? = null

            // Get the BluetoothSocket input and output streams
            try {
                tmpIn = mmSocket.inputStream
                tmpOut = mmSocket.outputStream
            } catch (e: Exception) {
                Log.e(TAG, "temp sockets not created", e)
                mModule.onError(e)
            }

            mmInStream = tmpIn
            mmOutStream = tmpOut
        }

        override fun run() {
            Log.i(TAG, "BEGIN mConnectedThread")
            val buffer = ByteArray(1024)
            var bytes: Int

            // Keep listening to the InputStream while connected
            while (true) {
                try {
                    bytes = mmInStream?.read(buffer) ?: 0 // Read from the InputStream
                    val data = String(buffer, 0, bytes, charset("ISO-8859-1"))

                    mModule.onData(data) // Send the new data String to the UI Activity
                } catch (e: Exception) {
                    Log.e(TAG, "disconnected", e)
                    mModule.onError(e)
                    connectionLost()
                    this@BluetoothSerialService.stop() // Start the service over to restart listening mode
                    break
                }
            }
        }

        /**
         * Write to the connected OutStream.
         * @param buffer  The bytes to write
         */
        fun write(buffer: ByteArray) {
            try {
                val str = String(buffer, charset("UTF-8"))
                if (D) Log.d(TAG, "Write in thread $str")
                mmOutStream?.write(buffer)
            } catch (e: Exception) {
                Log.e(TAG, "Exception during write", e)
                mModule.onError(e)
            }
        }

        fun cancel() {
            try {
                mmSocket.close()
            } catch (e: Exception) {
                Log.e(TAG, "close() of connect socket failed", e)
            }
        }
    }
}