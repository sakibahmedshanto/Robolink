import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
// @ts-ignore
import Draggable from 'react-native-draggable';
// @ts-ignore
import DirectionButton from '../components/DirectionButton';
// @ts-ignore
import ActionButton from '../components/ActionButton';
// @ts-ignore
import ToggleButton from '../components/ToggleButton';
// @ts-ignore
import SliderButton from '../components/SliderButton';

const BUTTON_TYPES = [
  { type: 'direction', label: 'Direction' },
  { type: 'action', label: 'Action' },
  { type: 'toggle', label: 'Toggle' },
  { type: 'slider', label: 'Slider' },
];

const CustomJoystickScreen = () => {
  const screen = Dimensions.get('window');
  const [layout, setLayout] = useState([
    { type: 'direction', label: 'Up', x: screen.width / 2 - 40, y: 100 },
    { type: 'direction', label: 'Down', x: screen.width / 2 - 40, y: 200 },
    { type: 'action', label: 'Fire', x: screen.width / 2 + 80, y: 150 },
    { type: 'toggle', label: 'Power', x: screen.width / 2 - 120, y: 150 },
    { type: 'slider', label: 'Speed', x: screen.width / 2 - 40, y: 300 },
  ]);
  const [newType, setNewType] = useState('direction');
  const [newLabel, setNewLabel] = useState('');

  const addButton = () => {
    if (!newLabel.trim()) return;
    setLayout([
      ...layout,
      { type: newType, label: newLabel, x: screen.width / 2 - 40, y: 400 },
    ]);
    setNewLabel('');
  };

  const removeButton = (idx: number) => {
    setLayout(layout.filter((_, i) => i !== idx));
  };

  // Removed PanResponder logic, now using Draggable

  return (
    <View style={styles.canvas}>
      <View style={styles.addArea}>
        <TextInput
          style={styles.input}
          placeholder="Button Label"
          value={newLabel}
          onChangeText={setNewLabel}
        />
        <View style={styles.typePicker}>
          {BUTTON_TYPES.map(btn => (
            <TouchableOpacity
              key={btn.type}
              style={[
                styles.typeButton,
                newType === btn.type && styles.typeButtonActive,
              ]}
              onPress={() => setNewType(btn.type)}
            >
              <Text style={styles.typeButtonText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Add Button" onPress={addButton} />
      </View>
      {layout.map((item, idx) => {
        let ButtonComponent = null;
        if (item.type === 'direction') ButtonComponent = DirectionButton;
        if (item.type === 'action') ButtonComponent = ActionButton;
        if (item.type === 'toggle') ButtonComponent = ToggleButton;
        if (item.type === 'slider') ButtonComponent = SliderButton;
        return (
          <Draggable
            key={idx}
            x={item.x}
            y={item.y}
            z={2}
            shouldReverse={false}
            onDrag={(e, gestureState) => {}}
            onPressOut={() => {
            }}
            onRelease={(e, gestureState) => {}}
            onDragRelease={(e, gestureState, bounds) => {}}
          >
            <View style={{ alignItems: 'center' }}>
              <ButtonComponent label={item.label} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeButton(idx)}
              >
                <Text style={styles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </Draggable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  addArea: {
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
    zIndex: 2,
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
  draggable: {
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
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
