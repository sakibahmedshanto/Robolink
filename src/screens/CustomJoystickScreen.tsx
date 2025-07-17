import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput } from 'react-native';
import DirectionButton from '../components/DirectionButton';
import ActionButton from '../components/ActionButton';
import ToggleButton from '../components/ToggleButton';
import SliderButton from '../components/SliderButton';

const BUTTON_TYPES = [
  { type: 'direction', label: 'Direction' },
  { type: 'action', label: 'Action' },
  { type: 'toggle', label: 'Toggle' },
  { type: 'slider', label: 'Slider' },
];

const CustomJoystickScreen = () => {
  const [layout, setLayout] = useState([
    { type: 'direction', label: 'Up' },
    { type: 'direction', label: 'Down' },
    { type: 'action', label: 'Fire' },
    { type: 'toggle', label: 'Power' },
    { type: 'slider', label: 'Speed' },
  ]);
  const [newType, setNewType] = useState('direction');
  const [newLabel, setNewLabel] = useState('');

  const addButton = () => {
    if (!newLabel.trim()) return;
    setLayout([...layout, { type: newType, label: newLabel }]);
    setNewLabel('');
  };

  const removeButton = (idx: number) => {
    setLayout(layout.filter((_, i) => i !== idx));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Virtual Joystick</Text>
      <View style={styles.addArea}>
        <TextInput
          style={styles.input}
          placeholder="Button Label"
          value={newLabel}
          onChangeText={setNewLabel}
        />
        <View style={styles.typePicker}>
          {BUTTON_TYPES.map((btn) => (
            <TouchableOpacity
              key={btn.type}
              style={[styles.typeButton, newType === btn.type && styles.typeButtonActive]}
              onPress={() => setNewType(btn.type)}
            >
              <Text style={styles.typeButtonText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Add Button" onPress={addButton} />
      </View>
      <View style={styles.joystickArea}>
        {layout.map((item, idx) => (
          <View key={idx} style={styles.buttonWrapper}>
            {item.type === 'direction' && <DirectionButton label={item.label} />}
            {item.type === 'action' && <ActionButton label={item.label} />}
            {item.type === 'toggle' && <ToggleButton label={item.label} />}
            {item.type === 'slider' && <SliderButton label={item.label} />}
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeButton(idx)}>
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addArea: {
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    width: 200,
    backgroundColor: '#f9f9f9',
  },
  typePicker: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  typeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: '#D72638',
  },
  typeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  joystickArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    // spacing handled by button component's margin
  },
  buttonWrapper: {
    alignItems: 'center',
    margin: 8,
  },
  removeBtn: {
    marginTop: 4,
    backgroundColor: '#D72638',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CustomJoystickScreen;
