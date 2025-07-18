/**
 * Save Layout Modal component for the Custom Joystick Screen
 * Allows users to save their current layout with a custom name
 */

import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, Alert } from 'react-native';

interface SaveLayoutModalProps {
  visible: boolean;
  layoutName: string;
  onChangeLayoutName: (name: string) => void;
  onSave: (name: string) => void;
  onCancel: () => void;
}

const SaveLayoutModal: React.FC<SaveLayoutModalProps> = ({
  visible,
  layoutName,
  onChangeLayoutName,
  onSave,
  onCancel,
}) => {
  /**
   * Handles the save action with validation
   */
  const handleSave = () => {
    if (layoutName && layoutName.trim()) {
      onSave(layoutName.trim());
    } else {
      Alert.alert('Error', 'Please enter a layout name');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Save Layout</Text>
          <Text style={styles.configLabel}>Enter a name for this layout:</Text>
          <TextInput
            style={styles.input}
            placeholder="Layout Name"
            value={layoutName}
            onChangeText={onChangeLayoutName}
            autoFocus={true}
          />
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
                Save
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

export default SaveLayoutModal;
