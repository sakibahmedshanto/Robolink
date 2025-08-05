/**
 * Button Configuration Modal component for the Custom Joystick Screen
 * Simplified modal for creating buttons with map name and value configuration
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ButtonConfig, ButtonTypeOption } from './types';
import {
  BUTTON_TYPES,
  DIRECTION_MAP_OPTIONS,
  ACTION_MAP_OPTIONS,
  SLIDER_MAP_OPTIONS,
  COLOR_OPTIONS
} from './constants';
import SliderButton from '../SliderButton';

interface ButtonConfigModalProps {
  visible: boolean;
  isEditMode: boolean;
  label: string;
  buttonType: 'direction' | 'action' | 'slider';
  config: ButtonConfig;
  onChangeLabel: (label: string) => void;
  onChangeButtonType: (type: 'direction' | 'action' | 'slider') => void;
  onChangeConfig: (config: ButtonConfig) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ButtonConfigModal: React.FC<ButtonConfigModalProps> = ({
  visible,
  isEditMode,
  label,
  buttonType,
  config,
  onChangeLabel,
  onChangeButtonType,
  onChangeConfig,
  onSave,
  onCancel,
}) => {
  /**
   * Updates a specific config property
   */
  const updateConfig = (key: keyof ButtonConfig, value: any) => {
    onChangeConfig({ ...config, [key]: value });
  };

  /**
   * Handles the save action with validation
   */
  const handleSave = () => {
    if (!label.trim()) {
      Alert.alert('Error', 'Please enter a button label');
      return;
    }
    if (!config.mapName.trim()) {
      Alert.alert('Error', 'Please select a map name');
      return;
    }
    onSave();
  };

  /**
   * Renders the button type picker
   */
  const renderTypePicker = () => (
    <View style={styles.typePicker}>
      {BUTTON_TYPES.map((btn: ButtonTypeOption) => (
        <TouchableOpacity
          key={btn.type}
          style={[
            styles.typeButton,
            buttonType === btn.type && styles.typeButtonActive,
          ]}
          onPress={() => {
            onChangeButtonType(btn.type as 'direction' | 'action' | 'slider');
            // Reset map name when type changes
            const defaultMapName = getDefaultMapName(btn.type as 'direction' | 'action' | 'slider');
            updateConfig('mapName', defaultMapName);
          }}
        >
          <Text style={styles.typeIcon}>{btn.icon}</Text>
          <Text style={styles.typeButtonText}>{btn.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  /**
   * Gets default map name for button type
   */
  const getDefaultMapName = (type: 'direction' | 'action' | 'slider'): string => {
    switch (type) {
      case 'direction':
        return DIRECTION_MAP_OPTIONS[0];
      case 'action':
        return ACTION_MAP_OPTIONS[0];
      case 'slider':
        return SLIDER_MAP_OPTIONS[0];
      default:
        return '';
    }
  };

  /**
   * Gets map options based on button type
   */
  const getMapOptions = (): string[] => {
    switch (buttonType) {
      case 'direction':
        return DIRECTION_MAP_OPTIONS;
      case 'action':
        return ACTION_MAP_OPTIONS;
      case 'slider':
        return SLIDER_MAP_OPTIONS;
      default:
        return [];
    }
  };

  /**
   * Renders the color picker
   */
  const renderColorPicker = () => (
    <View style={styles.colorPicker}>
      {COLOR_OPTIONS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorOption,
            { backgroundColor: color },
            config.color === color && styles.colorOptionSelected,
          ]}
          onPress={() => updateConfig('color', color)}
        />
      ))}
    </View>
  );

  /**
   * Renders map name picker
   */
  const renderMapNamePicker = () => (
    <>
      <Text style={styles.configLabel}>Map Name:</Text>
      <Picker
        selectedValue={config.mapName}
        style={styles.picker}
        onValueChange={(value) => updateConfig('mapName', value)}
      >
        {getMapOptions().map((mapName) => (
          <Picker.Item
            key={mapName}
            label={mapName.replace('_', ' ').toUpperCase()}
            value={mapName}
          />
        ))}
      </Picker>
    </>
  );
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>
              {isEditMode ? 'Edit Button' : 'Create New Button'}
            </Text>


            <Text style={styles.configLabel}>Button Type:</Text>
            {renderTypePicker()}

         
            <Text style={styles.configLabel}>Button Label:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter button label"
              value={label}
              onChangeText={onChangeLabel}
              maxLength={15}
            />

            {/* Map Name Picker */}
            {renderMapNamePicker()}

            {/* Map Value Input */}
            <Text style={styles.configLabel}>Map Value:</Text>
            <View style={styles.valueInputContainer}>
              <TextInput
                style={styles.valueInput}
                placeholder="100"
                value={config.mapValue.toString()}
                onChangeText={(text) => {
                  const value = parseInt(text) || 0;
                  updateConfig('mapValue', Math.max(0, Math.min(1000, value)));
                }}
                keyboardType="numeric"
                maxLength={4}
              />
              <Text style={styles.valueHint}>
                {buttonType === 'slider' ? '(0-1000 range)' : '(Typically 100)'}
              </Text>
            </View>

            {/* Size Slider */}
            <Text style={styles.configLabel}>Button Size:</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{config.size}</Text>
              <SliderButton
                value={config.size}
                minimumValue={40}
                maximumValue={120}
                onValueChange={(value: number) => updateConfig('size', Math.round(value))}
                label="Size"
              />
            </View>

            {/* Color Picker */}
            <Text style={styles.configLabel}>Button Color:</Text>
            {renderColorPicker()}

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={onCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSave}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>
                  {isEditMode ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1e293b',
  },
  configLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 20,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
    fontSize: 16,
    color: '#374151',
  },
  typePicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
  },
  typeIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  typeButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 12,
  },
  valueInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  valueInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
    fontSize: 16,
    color: '#374151',
    width: 80,
    textAlign: 'center',
  },
  valueHint: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 8,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    minWidth: 35,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  colorOption: {
    width: 45,
    height: 45,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  colorOptionSelected: {
    borderColor: '#1e293b',
    shadowColor: '#1e293b',
    shadowOpacity: 0.4,
  },
  picker: {
    height: 50,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 15,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  modalButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  modalButtonPrimaryText: {
    color: '#ffffff',
  },
});

export default ButtonConfigModal;
