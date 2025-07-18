/**
 * Button Configuration Modal component for the Custom Joystick Screen
 * Allows users to add new buttons or edit existing ones
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
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { ButtonConfig, ButtonTypeOption } from './types';
import { BUTTON_TYPES, DIRECTION_OPTIONS, ACTION_OPTIONS, COLOR_OPTIONS } from './constants';
import SliderButton from '../SliderButton';

interface ButtonConfigModalProps {
  visible: boolean;
  isEditMode: boolean;
  label: string;
  buttonType: string;
  config: ButtonConfig;
  onChangeLabel: (label: string) => void;
  onChangeButtonType: (type: string) => void;
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
          onPress={() => onChangeButtonType(btn.type)}
        >
          <Text style={styles.typeIcon}>{btn.icon}</Text>
          <Text style={styles.typeButtonText}>{btn.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

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
   * Renders direction picker for direction buttons
   */
  const renderDirectionPicker = () => {
    if (buttonType !== 'direction') return null;

    return (
      <>
        <Text style={styles.configLabel}>Direction:</Text>
        <Picker
          selectedValue={config.direction}
          style={styles.picker}
          onValueChange={(value) => updateConfig('direction', value)}
        >
          {DIRECTION_OPTIONS.map((dir) => (
            <Picker.Item key={dir} label={dir.replace('_', ' ')} value={dir} />
          ))}
        </Picker>
      </>
    );
  };

  /**
   * Renders action picker for action buttons
   */
  const renderActionPicker = () => {
    if (buttonType !== 'action') return null;

    return (
      <>
        <Text style={styles.configLabel}>Action:</Text>
        <Picker
          selectedValue={config.action}
          style={styles.picker}
          onValueChange={(value) => updateConfig('action', value)}
        >
          {ACTION_OPTIONS.map((action) => (
            <Picker.Item key={action} label={action} value={action} />
          ))}
        </Picker>
      </>
    );
  };

  /**
   * Renders sensitivity slider for slider and joystick buttons
   */
  const renderSensitivitySlider = () => {
    if (buttonType !== 'slider' && buttonType !== 'joystick') return null;

    return (
      <>
        <Text style={styles.configLabel}>Sensitivity:</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderValue}>{config.sensitivity}</Text>
          <SliderButton
            value={config.sensitivity}
            minimumValue={1}
            maximumValue={100}
            onValueChange={(value: number) => updateConfig('sensitivity', value)}
            label="Sensitivity"
          />
        </View>
      </>
    );
  };

  // Wrap the modal content with gesture handler
  const ModalContent = gestureHandlerRootHOC(() => (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <ScrollView>
          <Text style={styles.modalTitle}>
            {isEditMode ? 'Edit Button' : 'Add New Button'}
          </Text>

          {/* Label Input */}
          <Text style={styles.configLabel}>Label:</Text>
          <TextInput
            style={styles.input}
            placeholder="Button Label"
            value={label}
            onChangeText={onChangeLabel}
          />

          {/* Type Picker */}
          <Text style={styles.configLabel}>Type:</Text>
          {renderTypePicker()}

          {/* Size Slider */}
          <Text style={styles.configLabel}>Size:</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>{config.size}</Text>
            <SliderButton
              value={config.size}
              minimumValue={30}
              maximumValue={120}
              onValueChange={(value: number) => updateConfig('size', value)}
              label="Size"
            />
          </View>

          {/* Color Picker */}
          <Text style={styles.configLabel}>Color:</Text>
          {renderColorPicker()}

          {/* Direction Picker (conditional) */}
          {renderDirectionPicker()}

          {/* Action Picker (conditional) */}
          {renderActionPicker()}

          {/* Sensitivity Slider (conditional) */}
          {renderSensitivitySlider()}

          {/* Custom Command Input */}
          <Text style={styles.configLabel}>Custom Command:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter custom command (optional)"
            value={config.customCommand}
            onChangeText={(value) => updateConfig('customCommand', value)}
          />

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
                {isEditMode ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  ));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <ModalContent />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1e293b',
  },
  configLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
    fontSize: 16,
    color: '#374151',
  },
  typePicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    minWidth: 70,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
  },
  typeIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  typeButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    minWidth: 30,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 8,
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
    shadowOpacity: 0.3,
  },
  picker: {
    height: 50,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
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
