import { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, Button, Switch, PermissionsAndroid, Platform, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBluetoothStatus } from '../atoms/configs';
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
    fontSize: 12
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
        backgroundColor="#D72638"
        color={bluetoothStatus.isEnabled ? "#00ff47" : "#fff"}
        name={bluetoothStatus.isConnected ? "bluetooth-connected" : "bluetooth"}
        onPress={() => setButtonPressed('bluetooth')}
    />
    <Icon.Button
        name="wifi"
        backgroundColor="#D72638"
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
            <Text>Enable Bluetooth</Text>
            <Switch value={!!bluetoothStatus.isEnabled} onChange={toggleBluetooth} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginBottom: 10 }}>
            <Text>Enable Bluetooth Transmission</Text>
            <Switch value={!!bluetoothStatus.enableSendOverBT} onChange={toggleBluetoothTransmission} />
          </View>
          <View>
            <Text style={{fontSize: 10}}>Transmission Interval(ms)</Text>
            <TextInput
              keyboardType='numeric'
              placeholder='Interval Delay (ms)'
              value={String(bluetoothStatus.intervalDelay)}
              style={{ borderColor: '#ccc', borderWidth: 1, padding: 5, marginBottom: 10 }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginBottom: 10 }}>
            <Text>Paired Devices</Text>
            <MyButton title='View' onPress={() => setViewPairedDevices(true)} style={{ backgroundColor: primaryColor }} textStyle={{color: "#fff"}}/>
          </View>
          <View style={{ marginBottom: 10 }}>
            {
              bluetoothStatus.isConnected
                ?
                <>
                  <Text>Conntected To:</Text>
                  <Text style={{ fontSize: 12 }}>Device Name: {bluetoothStatus.deviceName || "Unknown"}</Text>
                  <Text style={{ fontSize: 12 }}>Device Address: {bluetoothStatus.deviceAddress || "Unknown"}</Text>
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
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>Paired Devices</Text>
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
  const [ip, setIp] = useState<string|null>(null);

  useEffect(() => {
    console.log(Network)
    Network.getIPAddress()
      .then(ipAddress => {
        console.log(ipAddress)
        setIp(ipAddress);
      })
  }, [])
  
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
          ip && 
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginBottom: 10 }}>
            <Text>IP:</Text>
            <Text>{ip}</Text>
          </View>
        }

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginBottom: 10 }}>
            <Text>Enable UDP Broadcast</Text>
            <Switch value={false} onChange={() => {}} />
          </View>

        <Button title="Close" onPress={onClose} color={primaryColor} />
      </View>
    </View>
    </Modal>
  )
}
