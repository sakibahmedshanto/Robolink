/**
 * Header component for the Custom Joystick Screen
 * Displays the current layout name and provides Edit/Add buttons
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import HeaderRightButtons from '../HeaderRightButtons';
import { SavedLayout } from './types';

interface HeaderProps {
    currentLayoutName: string;
    isEditMode: boolean;
    onToggleEditMode: () => void;
    onAddButton: () => void;
    onResetToGamepad?: () => void;
    onShowInstructions?: () => void;
    onSaveLayout?: () => void;
    savedLayouts?: SavedLayout[];
    onLoadLayout?: (layout: SavedLayout) => void;
    onDeleteLayout?: (layoutId: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    currentLayoutName,
    isEditMode,
    onToggleEditMode,
    onAddButton,
    onResetToGamepad,
    onShowInstructions,
    onSaveLayout,
    savedLayouts = [],
    onLoadLayout,
    onDeleteLayout
}) => {
    const [showLayoutDropdown, setShowLayoutDropdown] = useState(false);

    return (
        <View style={styles.header}>
            <View style={styles.leftSection}>
                <TouchableOpacity
                    style={styles.layoutDropdownButton}
                    onPress={() => setShowLayoutDropdown(true)}
                >
                    <Text style={styles.headerTitle}>{currentLayoutName}</Text>
                    <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>

                {onShowInstructions ? (
                    <TouchableOpacity
                        style={styles.helpButton}
                        onPress={onShowInstructions}
                    >
                        <Text style={styles.helpButtonText}>?</Text>
                    </TouchableOpacity>
                ) : null}
            </View>

            <View style={styles.headerControls}>
                {onResetToGamepad ? (
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={onResetToGamepad}
                    >
                        <Text style={styles.headerButtonText}>Reset</Text>
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={onToggleEditMode}
                >
                    <Text style={styles.headerButtonText}>
                        {isEditMode ? 'Done' : 'Edit'}
                    </Text>
                </TouchableOpacity>
                {(isEditMode && onSaveLayout) ? (
                    <TouchableOpacity
                        style={[styles.headerButton, styles.saveButton]}
                        onPress={onSaveLayout}
                    >
                        <Text style={styles.headerButtonText}>Save</Text>
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={onAddButton}
                >
                    <Text style={styles.headerButtonText}>Add</Text>
                </TouchableOpacity>
                <HeaderRightButtons />
            </View>

            {/* Saved Layouts Dropdown Modal */}
            <Modal
                visible={showLayoutDropdown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowLayoutDropdown(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setShowLayoutDropdown(false)}
                >
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownTitle}>Saved Layouts</Text>
                        <FlatList
                            data={savedLayouts}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.dropdownItem}>
                                    <TouchableOpacity
                                        style={styles.dropdownItemButton}
                                        onPress={() => {
                                            onLoadLayout?.(item);
                                            setShowLayoutDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{item.name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => {
                                            onDeleteLayout?.(item.id);
                                            setShowLayoutDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.deleteButtonText}>×</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No saved layouts</Text>
                            }
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#2a2a2a',
        borderBottomWidth: 1,
        borderBottomColor: '#444444',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
    helpButton: {
        backgroundColor: '#FFD700',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    }, helpButtonText: {
        color: '#000000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    headerControls: {
        flexDirection: 'row',
        gap: 8,
    },
    headerButton: {
        backgroundColor: '#4a4a4a',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    }, headerButtonText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 12,
    },
    saveButton: {
        backgroundColor: '#16a34a',
    },
    layoutDropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    dropdownIcon: {
        color: '#ffffff',
        fontSize: 12,
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    dropdownContainer: {
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 16,
        maxHeight: 300,
        width: '100%',
        maxWidth: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    dropdownTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#444444',
    },
    dropdownItemButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    dropdownItemText: {
        color: '#ffffff',
        fontSize: 14,
    },
    deleteButton: {
        backgroundColor: '#ff4444',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    deleteButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#999999',
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 20,
    },
});

export default Header;
