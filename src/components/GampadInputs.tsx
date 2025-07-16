import React, { useState, useEffect, use, useRef, useCallback } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BluetoothSerial, GlobalKeyEvent } from '../specs';
import { JoystickKeyMap } from '../const/JoystickKeyMap';
import { useBluetoothStatus, useDTS, useUdpStatus } from '../atoms/configs';
import MyButton from './Button';
import { primaryColor } from '../const/theme';
import TopHeaderButtons from './TopHeaderButtons';
import { broadcastUdpData, useUdpSocket } from '../atoms/udp';
// import { broadcastUdpData, udpSocket } from '../utils/udp';

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
  }
});

export default function GamepadViewer() {
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [inputs, setInputs] = useState<{ [key: string]: any }>({});
  const [ canEdit, setToggleEdit ] = useState(false);
  const [dts, setDTS] = useDTS();
  const [bluetoothStatus, _] = useBluetoothStatus();
  const [udpStatus, __] = useUdpStatus();
  const inputsRef = useRef(inputs);
  const dtsRef = useRef(dts);
  const btIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const udpIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { socket:udpSocket } = useUdpSocket();

  useEffect(() => {
    inputsRef.current = inputs;
  }, [inputs]);

  useEffect(() => {
    dtsRef.current = dts;
  }, [dts]);

  useEffect(() => {
    if (!bluetoothStatus.isConnected || !bluetoothStatus.enableSendOverBT) return;
    if (btIntervalRef.current) clearInterval(btIntervalRef.current);

    btIntervalRef.current = setInterval(() => {
      const inputs = inputsRef.current;
      const dts = dtsRef.current;
      const result = getMessage(dts, inputs);
      BluetoothSerial.writeToDevice(btoa(result));
    }, bluetoothStatus.intervalDelay || 100);
    return () => {
      if (btIntervalRef.current) clearInterval(btIntervalRef.current);
    };
  }, [bluetoothStatus.isConnected, bluetoothStatus.enableSendOverBT, bluetoothStatus.intervalDelay]);


  useEffect(() => {
    if (!udpStatus.enableSendOverUdp) {
      if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);
      return;
    }
    if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);

    udpIntervalRef.current = setInterval(() => {
      if (!udpStatus.enableSendOverUdp) {
        if(udpIntervalRef.current) clearInterval(udpIntervalRef.current);
        return;
      }
      
      const inputs = inputsRef.current;
      const dts = dtsRef.current;
      const result = getMessage(dts, inputs);
      if(udpSocket) broadcastUdpData(udpSocket, result, udpStatus.port);
      else console.warn('UDP socket not available');
    }, udpStatus.intervalDelay || 100);

    return () => {
      if (udpIntervalRef.current) clearInterval(udpIntervalRef.current);
    }
  
  }, [udpStatus.enableSendOverUdp, udpStatus.intervalDelay, udpStatus.port])

  useEffect(() => {
    const initialInputs = {
      ...Object.fromEntries(Object.keys(JoystickKeyMap).map(key => [key, 0])),
    };
    console.log('GamepadViewer initialInputs', initialInputs);
    setDTS(initialInputs);

    AsyncStorage.getItem('dts')
      .then((data) => {
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
  }

  const getMessage = (dts: any, inputs: any) => {
    let result = `<${Object.keys(dts).length} `;
    for (const [Key, val] of Object.entries(dts)) {
      result += `${inputs[Key] || 0} `;
    }
    result += '>';
    return result;
  }
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
  }

  const renderButton = (key: string) => {
    return (
      <View
        style={{
          ...styles.row,
          backgroundColor: inputs[key] ? '#00000010' : 'transparent',
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
        <CheckBox tintColors={{ true: canEdit ? primaryColor : "#ffffff33", false: 'white' }} onFillColor={canEdit ? primaryColor : "#ccc"} disabled={!canEdit} value={dts[key] || dts[key] == 0} onChange={() => toggleDTS(key)}
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
        <CheckBox tintColors={{ true: canEdit ? primaryColor : "#ffffff33", false: 'white' }} onFillColor={canEdit ? primaryColor : "#ccc"} disabled={!canEdit} value={dts[key] || dts[key] == 0} onChange={() => toggleDTS(key)}
        />
      </View>
    );
  };

  return (
    <ScrollView>
      <TopHeaderButtons
        enableCheck={canEdit}
        onCheckPress={onToggleCheck}
      />
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>Buttons</Text>
          {
            showSaveBtn && <MyButton title='Save' onPress={saveDTS} style={{backgroundColor: "#ff0"}} />
          }
        </View>
        <View
          style={{
            flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'stretch',
          }}
        >
          {['96', '97', '98', '99', '100', '101', '102', '103', '104', '105', '106', '107', '108', '109', '110'].map(renderButton)}
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
        <Text style={styles.title}>Data Format</Text>
        <Text style={styles.value}>
          {getMessage(dts, inputs)}
        </Text>
      </View>
    </ScrollView>
  );
}
