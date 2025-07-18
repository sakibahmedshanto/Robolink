/**
 * Header component for the Custom Joystick Screen
 * Displays the current layout name and provides Edit/Add buttons
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface HeaderProps {
  currentLayoutName: string;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onAddButton: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentLayoutName, 
  isEditMode, 
  onToggleEditMode, 
  onAddButton 
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{currentLayoutName}</Text>
      <View style={styles.headerControls}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onToggleEditMode}
        >
          <Text style={styles.headerButtonText}>
            {isEditMode ? 'Done' : 'Edit'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onAddButton}
        >
          <Text style={styles.headerButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  headerControls: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  headerButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Header;
