import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlobalKeyEvent } from '../specs';
import { JoystickKeyMap } from '../const/JoystickKeyMap';

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
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  row: {
    flexGrow: 1,
    flexDirection: 'row',
    padding: 2,
    borderWidth: 2,
    width: '30%',
    borderColor: '#ccc',
  },
  label: {
    fontSize: 13,
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default function GamepadViewer() {
  const [inputs, setInputs] = useState<{[key: string]: any}>({});

  useEffect(() => {
    const subs = [
      GlobalKeyEvent.addKeyUpListener(updateInputs),
      GlobalKeyEvent.addKeyDownListener(updateInputs),
      GlobalKeyEvent.onJoystickMoveListener(updateInputs)
    ];

    return () => subs.forEach(sub => sub.remove());
  }, []);

  const updateInputs = (evt) => {
    setInputs(prev => ({ ...prev, ...evt }));
  };

  const renderButton = (key: string) => {
    return (
      <View style={{ ...styles.row, backgroundColor: inputs[key] && inputs[key] !== 0 ? "#00000010" : "transparent" }} key={key}>
        <Text style={styles.label}>{JoystickKeyMap[key as keyof typeof JoystickKeyMap] || key}:</Text>
        <Text style={styles.value}> {inputs[key] || 0}</Text>
      </View>
    );
  };

  const renderAxis = (key) => {
    return (
      <View style={{ ...styles.row, backgroundColor: inputs[key] && inputs[key]?.toFixed(3) ? "#00000010" : "transparent" }} key={key}>
        <Text style={styles.label}>{JoystickKeyMap[key as keyof typeof JoystickKeyMap] || key}:</Text>
        <Text style={styles.value}> {inputs[key] || 0}</Text>
      </View>
    );
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Gamepad Inputs</Text>
      
      <Text style={styles.sectionTitle}>Buttons</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'stretch' }}>
        {['96','97','98','99','100','101','102','103','104','105','106','107','108','109','110']
          .map(renderButton)}
      </View>
      
      <Text style={styles.sectionTitle}>Axes</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'stretch' }}>
        {['leftX','leftY','rightX','rightY','hatX','hatY']
          .map(renderAxis)}
      </View>
      
      <Text style={styles.sectionTitle}>Triggers</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'stretch' }}>
        {['leftTrigger','rightTrigger']
          .map(renderAxis)}
      </View>
    </View>
    </ScrollView>
  );
}