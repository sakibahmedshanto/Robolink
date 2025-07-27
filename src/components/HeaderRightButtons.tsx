import { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, Button, Switch, PermissionsAndroid, Platform, TouchableOpacity, TextInput, TextInputChangeEvent } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBluetoothStatus, useUdpStatus } from '../atoms/configs';
import { BluetoothSerial, Network } from '../specs';
import MyButton from './Button';
import { primaryColor } from '../const/theme';
import { showToast } from './toast';


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
  },
  device: {
    paddingVertical: 10,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    paddingHorizontal: 3,
    fontSize: 12,
    color: "black" 
  },
  disabled: {
    color: '#ccc',
  },
  connectedDevice: {
    color: '#00ff47',
    fontWeight: 'bold',
  },
});

const HeaderRightButtons = () => {
    const [buttonPressed, setButtonPressed] = useState('');
    const [bluetoothStatus, _] = useBluetoothStatus();

  return (
  <View style={styles.container}>
    <Icon.Button
        color={bluetoothStatus.isEnabled ? "#00ff47" : "#fff"}
        backgroundColor="transparent"
        name={bluetoothStatus.isConnected ? "bluetooth-connected" : "bluetooth"}
        onPress={() => setButtonPressed('bluetooth')}
    />
    <Icon.Button
        name="wifi"
        backgroundColor="transparent"
        // color={buttonPressed == "wifi" ? "#00ff47" : "#fff"}
        onPress={() => setButtonPressed('wifi')}
    />
    <BluetoothModal visible={buttonPressed == 'bluetooth'} onClose={() => setButtonPressed('')} />
    <WifiModal visible={buttonPressed == 'wifi'} onClose={() => setButtonPressed('')} />
  </View>
  );
};

export default HeaderRightButtons;


const BluetoothModal = ({ visible, onClose }:{visible:boolean, onClose:() => void}) => {
    const [bluetoothStatus, setBluetoothStatus] = useBluetoothStatus();
    const [viewPairedDevices, setViewPairedDevices] = useState(false);

    const toggleBluetooth = async () => {
        if (+(Platform.Version) >= 31)
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
        
        if (bluetoothStatus.isEnabled) await BluetoothSerial.disable();
        else await BluetoothSerial.requestEnable();
        onClose();
    }

    const disconnectDevice = async () => {
        try {
            await BluetoothSerial.disconnect();
            setBluetoothStatus((prev:any) => ({
                ...prev,
                isConnected: false,
                deviceName: "",
                deviceAddress: "",
            }));
            showToast("Disconnected from device");
        } catch (error) {
            console.error("Error disconnecting from device:", error);
            showToast("Failed to disconnect from device");
        }
    }

    const toggleBluetoothTransmission = async () => {
      const previousStatus = bluetoothStatus.enableSendOverBT;
        if (bluetoothStatus.enableSendOverBT) {
            setBluetoothStatus((prev:any) => ({
                ...prev,
                enableSendOverBT: false,
            }));
            showToast("Bluetooth transmission disabled");
        } else {
            setBluetoothStatus((prev:any) => ({
                ...prev,
                enableSendOverBT: true,
            }));
            showToast("Bluetooth transmission enabled");
        }
        await AsyncStorage.setItem('enableBtTransmission', String(!previousStatus));
    }

    const handleIntervalChange = async (e:TextInputChangeEvent) => {
        const interval = parseInt(e.nativeEvent.text);
        if (isNaN(interval) || interval <= 0) {
            showToast("Invalid interval value");
            return;
        }
        setBluetoothStatus((prev:any) => ({
            ...prev,
            intervalDelay: interval,
        }));
        await AsyncStorage.setItem('btIntervalDelay', String(interval));
    }
    
    return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {
            viewPairedDevices ? <PairedDevices onClose={() => setViewPairedDevices(false)}/>
            :
        <View style={{ width: 320, padding: 10, backgroundColor: 'white', borderRadius: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{color: "black"}}>Enable Bluetooth</Text>
            <Switch value={!!bluetoothStatus.isEnabled} onChange={toggleBluetooth} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{color: "black"}}>Enable Bluetooth Transmission</Text>
            <Switch value={!!bluetoothStatus.enableSendOverBT} onChange={toggleBluetoothTransmission} />
          </View>
          <View>
            <Text style={{fontSize: 10}}>Transmission Interval(ms)</Text>
            <TextInput
              keyboardType='numeric'
              placeholder='Interval Delay (ms)'
              value={String(bluetoothStatus.intervalDelay)}
              onChange={handleIntervalChange}
              style={{ borderColor: '#ccc', borderWidth: 1, padding: 5, marginBottom: 10 }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{color: "black"}}>Paired Devices</Text>
            <MyButton title='View' onPress={() => setViewPairedDevices(true)} style={{ backgroundColor: primaryColor }} textStyle={{color: "#fff"}}/>
          </View>
          <View style={{ marginBottom: 10 }}>
            {
              bluetoothStatus.isConnected
                ?
                <>
                  <Text style={{color: "black"}}>Conntected To:</Text>
                  <Text style={{ fontSize: 12, color: "black" }}>Device Name: {bluetoothStatus.deviceName || "Unknown"}</Text>
                  <Text style={{ fontSize: 12, color: "black" }}>Device Address: {bluetoothStatus.deviceAddress || "Unknown"}</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <MyButton title='Disconnect' onPress={disconnectDevice} style={{ backgroundColor: primaryColor }}/>
                  </View>
                </> 
                : <Text style={{ color: primaryColor }}>Not Connected to any device</Text>
            }
          </View>
          <Button title="Close" onPress={onClose} color={primaryColor} />
        </View>
        }
      </View>
    </Modal>
  );
}

const PairedDevices = ({onClose}:{onClose:()=>void}) => {
    const [pairedDevices, setPairedDevices] = useState<any[]>([]);
    const [bluetoothStatus, setBluetoothStatus] = useBluetoothStatus();
    const [tryingToConnect, setTryingToConnect] = useState("");

    useEffect(() => {
        async function requestEnable() {
            if (+(Platform.Version) >= 31) {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
            }
            if (!bluetoothStatus.isEnabled) await BluetoothSerial.requestEnable();
        }
        requestEnable().then(() => {
            fetchPairedDevices();
        }).catch((err) => {
            console.error("Error requesting Bluetooth permissions:", err);
        });
    }, []);
    
    const fetchPairedDevices = async () => {
        const devices = await BluetoothSerial.list();
        setPairedDevices(devices);
    };
    
    const close = () => {
        setPairedDevices([]);
        onClose();
    };

    const connectTodDevice = async (device:any) => {
        try {
            setTryingToConnect(device.address)
            await BluetoothSerial.connect(device.address);
            // Update bluetooth status
            setBluetoothStatus((prev:any) => ({
                ...prev,
                deviceName: device.name,
                deviceAddress: device.address,
            }));
        } catch (error) {
            console.log("Error connecting to device:", error);
        } finally {
            setTryingToConnect("");
        }
    };
    return (
        <View style={{ padding: 10, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10, color: "black"  }}>Paired Devices</Text>
        <Button title="Refresh" onPress={fetchPairedDevices} color={primaryColor} />
        {pairedDevices.map((device) => (
            <TouchableOpacity
                onPress={() => connectTodDevice(device)}
                key={device.id}
                disabled={!bluetoothStatus.isEnabled || tryingToConnect == device.address}
                activeOpacity={0.5}
            >
                <Text style={[styles.device, tryingToConnect == device.address && styles.disabled,  bluetoothStatus.deviceAddress == device.address && styles.connectedDevice]}>{device.name} ({device.address})</Text>
            </TouchableOpacity>
        ))}
        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button title="Back" onPress={close} color={primaryColor} />
        </View>
        </View>
    );
    }



const WifiModal = ({ visible, onClose }:{visible:boolean, onClose:() => void}) => {
  const [udpStatus, setUdpStatus] = useUdpStatus();
  const [interval, setInterval] = useState(`${udpStatus.intervalDelay || 1234}`);

  useEffect(() => {
    Network.getIPAddress()
      .then(ipAddress => {
        console.log(ipAddress)
        setUdpStatus((prev)=>({...prev, ipAddress}));
      })
  }, [])
  const toggleUdp = async () => {
    const previousEnableUdp = udpStatus.enableSendOverUdp;
    console.log('🔧 UDP Toggle - Previous state:', previousEnableUdp);
    console.log('🔧 UDP Toggle - New state will be:', !previousEnableUdp);
    
    setUdpStatus((prev) => ({
      ...prev,
      enableSendOverUdp: !prev.enableSendOverUdp
    }));
    
    await AsyncStorage.setItem('enableUdpTransmission', String(!previousEnableUdp));
    console.log('🔧 UDP Toggle - Saved to AsyncStorage:', String(!previousEnableUdp));
    
    // Update UDP singleton immediately
    const UdpManager = require('../services/UdpManager').default;
    const udpManager = UdpManager.getInstance();
    await udpManager.initialize({
      port: udpStatus.port,
      enabled: !previousEnableUdp,
      intervalDelay: udpStatus.intervalDelay
    });
  }


    const handleIntervalChange = async (e:TextInputChangeEvent) => {
        setInterval(e.nativeEvent.text);
      }


    const saveInterval = async () => {
        const _interval = parseInt(interval);
        if (isNaN(_interval) || _interval <= 0) {
            showToast("Invalid interval value");
            return;
        }
        setUdpStatus((prev:any) => ({
            ...prev,
            intervalDelay: _interval,
        }));
        await AsyncStorage.setItem('udpIntervalDelay', String(_interval));
    }
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: 320, padding: 10, backgroundColor: 'white', borderRadius: 10 }}>
        {
          udpStatus.ipAddress ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{color: "black"}}>IP:</Text>
            <Text style={{color: "black"}}>{udpStatus.ipAddress}</Text>
          </View>
          ) : null
        }

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{color: "black"}}>Enable UDP Broadcast</Text>
            <Switch value={udpStatus.enableSendOverUdp} onChange={toggleUdp} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", gap: 10 }}>
            <View  style={{ flex: 1 }}>
              <Text style={{fontSize: 10, color: "black" }}>Transmission Interval(ms)</Text>
              <TextInput
                keyboardType='numeric'
                placeholder='Interval Delay (ms)'
                value={String(interval)}
                onChange={handleIntervalChange}
                style={{ borderColor: '#ccc', borderWidth: 1, padding: 5, marginBottom: 10, color: "black"  }}
              />
            </View>
            {
              interval !== `${udpStatus.intervalDelay}` ?
              (
                <MyButton
                 title='Save'
                 style={{ backgroundColor: '#ef53504f' }}
                 onPress={saveInterval}
                />
              ) : null
            }
          </View>
        <Button title="Close" onPress={onClose} color={primaryColor} />
      </View>
    </View>
    </Modal>
  )
}