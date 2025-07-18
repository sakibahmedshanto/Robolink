/**
 * Settings Panel component for the Custom Joystick Screen
 * Displays when in edit mode and provides save layout functionality
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SettingsPanelProps {
  isEditMode: boolean;
  onSaveLayout: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isEditMode, 
  onSaveLayout 
}) => {
  // Don't render anything if not in edit mode
  if (!isEditMode) {
    return null;
  }

  return (
    <View style={styles.settingsPanel}>
      <TouchableOpacity
        style={styles.saveButton}
        onPress={onSaveLayout}
      >
        <Text style={styles.saveButtonText}>Save Layout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  settingsPanel: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default SettingsPanel;
