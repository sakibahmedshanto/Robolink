/**
 * Saved Layouts component for the Custom Joystick Screen
 * Displays horizontally scrollable list of saved layouts
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SavedLayout } from './types';

interface SavedLayoutsProps {
  savedLayouts: SavedLayout[];
  onLoadLayout: (layout: SavedLayout) => void;
  onDeleteLayout: (layoutId: string) => void;
}

const SavedLayouts: React.FC<SavedLayoutsProps> = ({
  savedLayouts,
  onLoadLayout,
  onDeleteLayout,
}) => {
  // Don't render if no saved layouts
  if (savedLayouts.length === 0) {
    return null;
  }

  return (
    <View style={styles.savedLayouts}>
      <Text style={styles.savedLayoutsTitle}>Saved Layouts:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {savedLayouts.map((layout) => (
          <View key={layout.id} style={styles.savedLayoutItem}>
            <TouchableOpacity
              style={styles.savedLayoutButton}
              onPress={() => onLoadLayout(layout)}
            >
              <Text style={styles.savedLayoutButtonText}>{layout.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteSavedLayout}
              onPress={() => onDeleteLayout(layout.id)}
            >
              <Text style={styles.deleteSavedLayoutText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  savedLayouts: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  savedLayoutsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1e293b',
  },
  savedLayoutItem: {
    flexDirection: 'row',
    marginRight: 12,
    alignItems: 'center',
  },
  savedLayoutButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  savedLayoutButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteSavedLayout: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 6,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  deleteSavedLayoutText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default SavedLayouts;
