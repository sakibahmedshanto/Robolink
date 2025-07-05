import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { GlobalKeyEvent } from '../specs';
import { JoystickKeyMap } from '../const/JoystickKeyMap';
import { useDTS } from '../atoms/configs';

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
  const [inputs, setInputs] = useState<{ [key: string]: any }>({});
  const [dts, setDTS] = useDTS();

  useEffect(() => {
    const initialInputs = {
      ...Object.fromEntries(Object.keys(JoystickKeyMap).map(key => [key, 0])),
    };
    console.log('GamepadViewer initialInputs', initialInputs);
    setDTS(initialInputs);
  }, []);

  useEffect(() => {
    const subs = [
      GlobalKeyEvent.addKeyUpListener(updateInputs),
      GlobalKeyEvent.addKeyDownListener(updateInputs),
      GlobalKeyEvent.onJoystickMoveListener(updateInputs),
    ];

    return () => subs.forEach(sub => sub.remove());
  }, []);

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
  };

  const renderButton = (key: string) => {
    return (
      <View
        style={{
          ...styles.row,
          backgroundColor:
            inputs[key] && inputs[key] !== 0 ? '#00000010' : 'transparent',
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
        <CheckBox disabled={false} value={dts[key] || dts[key] == 0} onChange={() => toggleDTS(key)}
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
        <CheckBox disabled={false} value={dts[key] || dts[key] == 0} onChange={() => toggleDTS(key)}
        />
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Buttons</Text>
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
        <Text style={styles.title}>Data Format</Text>
        <Text style={styles.value}>
          {"<"}{Object.keys(dts).length} {Object.entries(dts).map(([Key, val]) => `${val} `)}{">"}
        </Text>
      </View>
    </ScrollView>
  );
}
