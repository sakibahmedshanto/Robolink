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
    onShowHelp?: () => void; // Add help button handler
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
    onShowHelp, // Add help handler
    savedLayouts = [],
    onLoadLayout,
    onDeleteLayout,
    // Data transmission props
    buttonStates = {},
    joystickData = {},
    formatMessage
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
                {onShowHelp ? (
                    <TouchableOpacity
                        style={[styles.headerButton, styles.helpHeaderButton]}
                        onPress={onShowHelp}
                    >
                        <Text style={styles.headerButtonText}>Help</Text>
                    </TouchableOpacity>
                ) : null}
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
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#D72638', // Elegant red background
        borderBottomWidth: 0.5,
        borderBottomColor: '#ffffff1a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 4,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    }, headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    helpButton: {
        backgroundColor: '#ffffff20',
        width: 28,
        height: 28,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    }, helpButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    headerControls: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
    },
    headerButton: {
        backgroundColor: '#ffffff20',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4,
    }, headerButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    }, saveButton: {
        backgroundColor: '#B91E30', // Darker red for save button contrast
    },
    helpHeaderButton: {
        backgroundColor: '#2563eb', // Blue color for help button
    },
    layoutDropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4,
        backgroundColor: '#ffffff20',
    }, dropdownIcon: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 6,
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
    }, dataTransmissionContainer: {
        backgroundColor: '#ffffff20',
        padding: 6,
        marginLeft: 8,
        borderRadius: 4,
        maxWidth: 180,
    },
    dataTransmissionText: {
        color: '#fff',
        fontSize: 9,
        fontFamily: 'monospace',
        textAlign: 'left',
    },
});

export default Header;
