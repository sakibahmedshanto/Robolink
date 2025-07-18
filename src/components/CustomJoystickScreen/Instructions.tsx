/**
 * Instructions overlay for the gamepad layout
 * Shows helpful tips about the gamepad controls
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface InstructionsProps {
    visible: boolean;
    onClose: () => void;
}

const Instructions: React.FC<InstructionsProps> = ({ visible, onClose }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Gamepad Layout Guide</Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎮 Controls</Text>
                        <Text style={styles.text}>• Left/Right Joysticks: Movement and camera</Text>
                        <Text style={styles.text}>• D-Pad: Directional controls</Text>
                        <Text style={styles.text}>• A/B/X/Y: Action buttons</Text>
                        <Text style={styles.text}>• L1/L2/R1/R2: Shoulder buttons</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>⚙️ Macro Buttons</Text>
                        <Text style={styles.text}>• 1-6 MACRO: Custom programmable buttons</Text>
                        <Text style={styles.text}>• MENU/BACK: System controls</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>✏️ Editing</Text>
                        <Text style={styles.text}>• Tap "Edit" to move and modify buttons</Text>
                        <Text style={styles.text}>• Tap "Add" to create new buttons</Text>
                        <Text style={styles.text}>• Tap "Reset" to restore default layout</Text>
                    </View>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Got it!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#2a2a2a',
        padding: 24,
        borderRadius: 12,
        width: '90%',
        maxWidth: 400,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 20,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFD700',
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        color: '#cccccc',
        marginBottom: 4,
        paddingLeft: 8,
    },
    closeButton: {
        backgroundColor: '#4a4a4a',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Instructions;
