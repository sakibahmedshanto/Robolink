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
    // Data transmission props
    buttonStates?: { [key: string]: number };
    joystickData?: { [key: string]: number };
    formatMessage?: (data: any) => string;
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
    onDeleteLayout,
    // Data transmission props
    buttonStates = {},
    joystickData = {},
    formatMessage
}) => {
    const [showLayoutDropdown, setShowLayoutDropdown] = useState(false);    return (
        <View style={styles.header}>
            <View style={styles.leftSection}>
                <TouchableOpacity
                    style={styles.layoutDropdownButton}
                    onPress={() => setShowLayoutDropdown(true)}
                >
                    <Text style={styles.headerTitle}>{currentLayoutName}</Text>
                    <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>

                {/* Data transmission display - moved to left section */}
                {formatMessage && (
                    <View style={styles.dataTransmissionContainer}>
                        <Text style={styles.dataTransmissionText}>
                            📡 {formatMessage({ ...buttonStates, ...joystickData })}
                        </Text>
                    </View>
                )}

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
                        {isEditMode ? 'Save' : 'Edit'}
                    </Text>
                </TouchableOpacity>
                {(isEditMode && onSaveLayout) ? (
                    <TouchableOpacity
                        style={[styles.headerButton, styles.saveButton]}
                        onPress={onSaveLayout}
                    >
                        <Text style={styles.headerButtonText}>Save As</Text>
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
        paddingVertical: 12,
        backgroundColor: '#170F11', // Same as GamepadInputScreen
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff2a',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    helpButton: {
        backgroundColor: '#ffffff2a',
        width: 32,
        height: 32,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    helpButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerControls: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    headerButton: {
        backgroundColor: '#ffffff2a',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
    },
    headerButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    saveButton: {
        backgroundColor: '#D72638', // Primary color for save button
    },
    layoutDropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: '#ffffff2a',
    },
    dropdownIcon: {
        color: '#fff',
        fontSize: 14,
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
        backgroundColor: '#170F11',
        borderRadius: 8,
        padding: 16,
        maxHeight: 300,
        width: '100%',
        maxWidth: 300,
        borderWidth: 1,
        borderColor: '#ffffff2a',
    },
    dropdownTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff2a',
    },
    dropdownItemButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    dropdownItemText: {
        color: '#fff',
        fontSize: 14,
    },
    deleteButton: {
        backgroundColor: '#D72638',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#ffffff2a',
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 20,
    },
    dataTransmissionContainer: {
        backgroundColor: '#ffffff2a',
        padding: 8,
        marginLeft: 12,
        borderRadius: 6,
        maxWidth: 200,
    },
    dataTransmissionText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'monospace',
        textAlign: 'left',
    },
});

export default Header;
