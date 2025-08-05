/**
 * Button Configuration Modal component for the Custom Joystick Screen
 * Sleek, compact modal for creating buttons with unified map system
 */

import React, { useState } from 'react';
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
  ALL_MAP_OPTIONS,
  COLOR_OPTIONS
} from './constants';

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
  const [isCustomMap, setIsCustomMap] = useState(false);
  const [customMapName, setCustomMapName] = useState('');

  // Initialize custom map state when modal opens
  React.useEffect(() => {
    if (visible) {
      const isConfigCustom = !ALL_MAP_OPTIONS.includes(config.mapName);
      setIsCustomMap(isConfigCustom);
      if (isConfigCustom) {
        setCustomMapName(config.mapName);
      } else {
        setCustomMapName('');
      }
    }
  }, [visible, config.mapName]);

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

    if (isCustomMap) {
      if (!customMapName.trim()) {
        Alert.alert('Error', 'Please enter a custom map name');
        return;
      }
      const finalMapName = customMapName.trim().toLowerCase().replace(/\s+/g, '_');
      // Update the config with the custom map name before saving
      const updatedConfig = { ...config, mapName: finalMapName };
      onChangeConfig(updatedConfig);

      // Small delay to ensure state is updated before saving
      setTimeout(() => {
        onSave();
      }, 10);
    } else {
      onSave();
    }
  };

  /**
   * Handles map selection
   */
  const handleMapChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomMap(true);
      setCustomMapName('');
    } else {
      setIsCustomMap(false);
      updateConfig('mapName', value);
    }
  };

  return (
  <Modal
    visible={visible}
    animationType="fade"
    transparent={true}
    onRequestClose={onCancel}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.modalTitle}>
            {isEditMode ? 'Edit Button' : 'Create Button'}
          </Text>

          {/* Button Type Pills */}
          <View style={styles.typePicker}>
            {BUTTON_TYPES.map((btn: ButtonTypeOption) => (
              <TouchableOpacity
                key={btn.type}
                style={[
                  styles.typePill,
                  buttonType === btn.type && styles.typePillActive,
                ]}
                onPress={() => onChangeButtonType(btn.type)}
              >
                <Text style={styles.typeIcon}>{btn.icon}</Text>
                <Text style={[
                  styles.typePillText,
                  buttonType === btn.type && styles.typePillTextActive
                ]}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Compact Form Row 1: Label + Map */}
          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Label</Text>
              <TextInput
                style={styles.compactInput}
                placeholder="Button name"
                value={label}
                onChangeText={onChangeLabel}
                maxLength={12}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Map</Text>
              {!isCustomMap ? (
                <Picker
                  selectedValue={config.mapName}
                  style={styles.compactPicker}
                  onValueChange={handleMapChange}
                >
                  {ALL_MAP_OPTIONS.map((mapName) => (
                    <Picker.Item
                      key={mapName}
                      label={mapName === 'custom' ? '+ Custom' : mapName.toUpperCase()}
                      value={mapName}
                    />
                  ))}
                </Picker>
              ) : (
                <View style={styles.customMapContainer}>
                  <TextInput
                    style={styles.compactInput}
                    placeholder="custom_name"
                    value={customMapName}
                    onChangeText={setCustomMapName}
                    maxLength={15}
                  />
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setIsCustomMap(false)}
                  >
                    <Text style={styles.backButtonText}>←</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Compact Form Row 2: Value + Size */}
          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Value</Text>
              <TextInput
                style={styles.compactInput}
                placeholder="100"
                value={config.mapValue.toString()}
                onChangeText={(text) => {
                  const value = parseInt(text) || 0;
                  updateConfig('mapValue', Math.max(0, Math.min(1000, value)));
                }}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Size: {config.size}</Text>
              <View style={styles.sliderContainer}>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => updateConfig('size', Math.max(30, config.size - 10))}
                >
                  <Text style={styles.sliderButtonText}>-</Text>
                </TouchableOpacity>
                <View style={[styles.sliderTrack, { width: config.size * 1.5 }]} />
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => updateConfig('size', Math.min(100, config.size + 10))}
                >
                  <Text style={styles.sliderButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Compact Color Picker */}
          <View style={styles.colorSection}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorPicker}>
              {COLOR_OPTIONS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorDot,
                    { backgroundColor: color },
                    config.color === color && styles.colorDotSelected,
                  ]}
                  onPress={() => updateConfig('color', color)}
                />
              ))}
             </View>
          </View>
        </ScrollView>

        {/* Action Buttons - Fixed at bottom */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isEditMode ? 'Update' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#333',
    maxHeight: '85%', // Increased from 80% to show more content
    minHeight: 300, // Ensure minimum height for all content
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },  typePicker: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
    minHeight: 40, // Ensure minimum height for visibility
  },
  typePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10, // Increased padding
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444',
    gap: 4,
    minHeight: 40, // Ensure minimum height
  },
  typePillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  typeIcon: {
    fontSize: 14,
  },
  typePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  typePillTextActive: {
    color: '#fff',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 4,
  },
  compactInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
  },
  compactPicker: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    height: 40,
    color: '#fff',
  },
  customMapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    backgroundColor: '#444',
    borderRadius: 6,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderButton: {
    backgroundColor: '#444',
    borderRadius: 6,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#2563eb',
    borderRadius: 2,
    minWidth: 20,
  },
  colorSection: {
    marginBottom: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotSelected: {
    borderColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12, // Increased margin for better separation
    paddingTop: 8, // Add padding for visual separation
    borderTopWidth: 1,
    borderTopColor: '#333', // Add subtle separator line
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },  scrollContainer: {
    flex: 1,
    maxHeight: '85%', // Ensure scroll area doesn't take full height
  },
  scrollContent: {
    paddingBottom: 10,
    flexGrow: 1, // Allow content to grow as needed
  },
});

export default ButtonConfigModal;
