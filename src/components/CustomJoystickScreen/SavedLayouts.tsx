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
        backgroundColor: '#2a2a2a',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#444444',
    },
    savedLayoutsTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#ffffff',
    },
    savedLayoutItem: {
        flexDirection: 'row',
        marginRight: 8,
        alignItems: 'center',
    },
    savedLayoutButton: {
        backgroundColor: '#4a4a4a',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    savedLayoutButtonText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 12,
    },
    deleteSavedLayout: {
        backgroundColor: '#dc2626',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4,
        marginLeft: 4,
        shadowColor: '#dc2626',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
    },
    deleteSavedLayoutText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 10,
    },
});

export default SavedLayouts;
