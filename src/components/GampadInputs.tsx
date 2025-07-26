import React, { useState, useEffect, use, useRef, useCallback } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
import { BluetoothSerial, GlobalKeyEvent } from '../specs';
import { JoystickKeyMap } from '../const/JoystickKeyMap';
import { useBluetoothStatus, useDTS, useUdpStatus } from '../atoms/configs';
import MyButton from './Button';
import { primaryColor } from '../const/theme';
import TopHeaderButtons from './TopHeaderButtons';
import { sendGamepadData, useUdpSocket } from '../atoms/udp';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 600,
    marginHorizontal: 'auto',
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
    color: '#fff',
  },
  row: {
    flexGrow: 1,
    flexDirection: 'row',
    paddingHorizontal: 4,
    borderWidth: 1,
    width: '48%',
    borderColor: '#ffffff40',
  },
  label: {
    fontSize: 13,
    color: '#fff',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
  },
  dts: {
    paddingTop: 16,
  },
});

export default function GamepadViewer() {
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [inputs, setInputs] = useState<{ [key: string]: any }>({});
  const [canEdit, setToggleEdit] = useState(false);
  const [dts, setDTS] = useDTS();
  const [bluetoothStatus, _] = useBluetoothStatus();
  const [udpStatus, __] = useUdpStatus();
  const inputsRef = useRef(inputs);
  const dtsRef = useRef(dts);
  const btIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const udpIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<string>(''); // Track last sent data
  const { socket: udpSocket } = useUdpSocket();

  useEffect(() => {
    inputsRef.current = inputs;
  }, [inputs]);

  useEffect(() => {
    dtsRef.current = dts;
  }, [dts]);
  useEffect(() => {
    if (!bluetoothStatus.isConnected || !bluetoothStatus.enableSendOverBT)
      return;
    if (btIntervalRef.current) clearInterval(btIntervalRef.current);

    btIntervalRef.current = setInterval(() => {
      const inputs = inputsRef.current;
      const dts = dtsRef.current;
      // Create simple key-value format - much easier for Arduino/ESP32 to parse
      const gamepadValues: string[] = [];

      // Add all active inputs as simple key=value pairs
      Object.keys(dts).forEach(key => {
        const value = inputs[key] || 0;
        const keyName = JoystickKeyMap[key as keyof typeof JoystickKeyMap] || key;

        // Only send non-zero values to reduce data size
        if (value !== 0) {
          gamepadValues.push(`${keyName}=${value}`);
        }
      });

      const simpleMessage = gamepadValues.join(',');
      BluetoothSerial.writeToDevice(simpleMessage); console.log('📡 Sent gamepad data via Bluetooth:', simpleMessage);
    }, bluetoothStatus.intervalDelay || 100);

    return () => {
      if (btIntervalRef.current) clearInterval(btIntervalRef.current);
    };
  }, [
    bluetoothStatus.isConnected,
    bluetoothStatus.enableSendOverBT,
    bluetoothStatus.intervalDelay,
  ]);
  useEffect(() => {
    if (!udpStatus.enableSendOverUdp) {
      if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);
      return;
    }
    if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);

    udpIntervalRef.current = setInterval(() => {
      if (!udpStatus.enableSendOverUdp) {
        if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);
        return;
      } const inputs = inputsRef.current;
      const dts = dtsRef.current;

      // Create simple key-value format - much easier for Arduino/ESP32 to parse
      const gamepadValues: string[] = [];

      // Add all active inputs as simple key=value pairs
      Object.keys(dts).forEach(key => {
        const value = inputs[key] || 0;
        const keyName = JoystickKeyMap[key as keyof typeof JoystickKeyMap] || key;

        // Only send non-zero values to reduce data size
        if (value !== 0) {
          gamepadValues.push(`${keyName}=${value}`);
        }
      });      // Format: "LX=0.5,RY=-0.8,A=1,B=0" - super easy to parse with split() and simple string operations
      const simpleMessage = gamepadValues.join(',');      if (udpSocket) {
        try {
          const buffer = Buffer.from(simpleMessage, 'utf8');
          const targetPort = parseInt(udpStatus.port as any) || 1234;

          // Check if socket is ready before sending
          if (typeof udpSocket.send === 'function') {
            // Send without callback to prevent memory leaks
            udpSocket.send(buffer, 0, buffer.length, targetPort, '255.255.255.255');
            console.log('📡 Sent gamepad data via UDP:', simpleMessage);
          } else {
            console.warn('UDP socket not ready for sending');
          }
        } catch (error) {
          console.error('UDP send exception:', error);
        }
      } else {console.warn('UDP socket not available - ensure UDP is enabled in settings');
      }
    }, udpStatus.intervalDelay || 100);

    return () => {
      if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);
    };
  }, [udpStatus.enableSendOverUdp, udpStatus.intervalDelay, udpStatus.port, udpSocket]);

  useEffect(() => {
    const initialInputs = {
      ...Object.fromEntries(Object.keys(JoystickKeyMap).map(key => [key, 0])),
    };
    console.log('GamepadViewer initialInputs', initialInputs);
    setDTS(initialInputs);

    AsyncStorage.getItem('dts').then(data => {
      if (data) {
        const parsedData = JSON.parse(data);
        setDTS(parsedData);
        setInputs(prev => ({ ...prev, ...parsedData }));
      } else setDTS(initialInputs);
    });
  }, []);

  useEffect(() => {
    const subs = [
      GlobalKeyEvent.addKeyUpListener(updateInputs),
      GlobalKeyEvent.addKeyDownListener(updateInputs),
      GlobalKeyEvent.onJoystickMoveListener(updateInputs),
    ];

    return () => subs.forEach(sub => sub.remove());
  }, []);
  const onToggleCheck = () => {
    setToggleEdit(prev => !prev);
  };
  const getGamepadDataPreview = (dts: any, inputs: any) => {
    // Create simple key-value format preview - much easier for Arduino/ESP32 to parse
    const gamepadValues: string[] = [];

    // Add all active inputs as simple key=value pairs
    Object.keys(dts).forEach(key => {
      const value = inputs[key] || 0;
      const keyName = JoystickKeyMap[key as keyof typeof JoystickKeyMap] || key;

      // Show all values in preview (including zeros for reference)
      gamepadValues.push(`${keyName}=${value}`);
    });

    // Format: "LX=0.5,RY=-0.8,A=1,B=0" - super easy to parse with split() and simple string operations
    const simpleFormat = gamepadValues.join(',');

    return (
      <View>
        <Text style={styles.value}>Simple Format (Arduino/ESP32 friendly):</Text>

        <Text style={[styles.value, { fontFamily: 'monospace', marginVertical: 8 }]}>
          {simpleFormat}
        </Text>

        <Text style={styles.value}>Example Arduino parsing:</Text>

        <Text style={[styles.value, { fontFamily: 'monospace', fontSize: 11, marginTop: 4 }]}>
          String data = "{simpleFormat}";
        </Text>

        <Text style={[styles.value, { fontFamily: 'monospace', fontSize: 11 }]}>
          {`// Split by ',' then by '=' to get key-value pairs`}
        </Text>
      </View>
    );
  };
  const updateInputs = (evt: { [key: string]: any }) => {
    setInputs(prev => ({ ...prev, ...evt }));
  };

  const toggleDTS = (key: string) => {
    if (dts[key] || dts[key] == 0) {
      setDTS(prev => {
        delete prev[key];
        return { ...prev };
      });
    } else {
      setDTS(prev => ({ ...prev, [key]: inputs[key] || 0 }));
    }
    setShowSaveBtn(true);
  };

  const saveDTS = async () => {
    await AsyncStorage.setItem('dts', JSON.stringify(dts));
    setShowSaveBtn(false);
  };

  const renderButton = (key: string) => {
    return (
      <View style={{
        ...styles.row,
        backgroundColor: inputs[key] ? '#00000010' : 'transparent',
      }}
        key={key}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={styles.label}>
            {JoystickKeyMap[key as keyof typeof JoystickKeyMap] || key}:
          </Text>
          <Text style={styles.value}> {inputs[key] || 0}</Text>
        </View>
        <CheckBox
          tintColors={{
            true: canEdit ? primaryColor : '#ffffff33',
            false: 'white',
          }}
          onFillColor={canEdit ? primaryColor : '#ccc'}
          disabled={!canEdit}
          value={dts[key] || dts[key] == 0}
          onChange={() => toggleDTS(key)}
        />
      </View>
    );
  };

  const renderAxis = (key: string) => {
    return (
      <View
        style={{
          ...styles.row,
          backgroundColor:
            inputs[key] && inputs[key]?.toFixed(3)
              ? '#00000010'
              : 'transparent',
        }}
        key={key}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={styles.label}>
            {JoystickKeyMap[key as keyof typeof JoystickKeyMap] || key}:
          </Text>
          <Text style={styles.value}> {inputs[key] || 0}</Text>
        </View>
        <CheckBox
          tintColors={{
            true: canEdit ? primaryColor : '#ffffff33',
            false: 'white',
          }}
          onFillColor={canEdit ? primaryColor : '#ccc'}
          disabled={!canEdit}
          value={dts[key] || dts[key] == 0}
          onChange={() => toggleDTS(key)}
        />
      </View>
    );
  };

  return (
    <ScrollView>
      <TopHeaderButtons enableCheck={canEdit} onCheckPress={onToggleCheck} />
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={styles.sectionTitle}>Buttons</Text>
          {showSaveBtn ? (
            <MyButton
              title="Save"
              onPress={saveDTS}
              style={{ backgroundColor: '#ff0' }}
            />
          ) : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'stretch',
          }}
        >
          {[
            '96',
            '97',
            '98',
            '99',
            '100',
            '101',
            '102',
            '103',
            '104',
            '105',
            '106',
            '107',
            '108',
            '109',
            '110',
          ].map(renderButton)}
        </View>

        <Text style={styles.sectionTitle}>Axes</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'stretch',
          }}
        >
          {['leftX', 'leftY', 'rightX', 'rightY', 'hatX', 'hatY'].map(
            renderAxis,
          )}
        </View>

        <Text style={styles.sectionTitle}>Triggers</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'stretch',
          }}
        >
          {['leftTrigger', 'rightTrigger'].map(renderAxis)}
        </View>
      </View>
      <View style={styles.dts}>
        <Text style={styles.title}>Simple Data Format (Arduino/ESP32 Friendly!)</Text>
        <ScrollView style={{ maxHeight: 200 }}>
          {getGamepadDataPreview(dts, inputs)}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
