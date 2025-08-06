import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { authStyles } from '../styles/authStyles';

interface GamepadSelectionScreenProps {
    onLogout: () => void;
    onNavigateToCustomScreen?: () => void;
}

const GamepadSelectionScreen: React.FC<GamepadSelectionScreenProps> = ({ onLogout, onNavigateToCustomScreen }) => {
    const handleGamepadSelection = (type: string) => {
        if (type === 'Custom Control') {
            // Navigate to custom screen
            if (onNavigateToCustomScreen) {
                onNavigateToCustomScreen();
            }
        } else {
            Alert.alert('Coming Soon', `${type} will be available soon!`);
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: onLogout,
            },
        ]);
    };
    return (
        <View style={authStyles.container}>
            <View style={authStyles.selectionContainer}>
                <View style={authStyles.selectionContent}>
                  
                    <View style={authStyles.header}>
                        <Text style={authStyles.title}>Welcome to Robolink</Text>
                        <Text style={authStyles.subtitle}>Choose your gamepad type</Text>
                    </View>
                    
                    <View style={authStyles.optionsContainer}>
                        <TouchableOpacity
                            style={authStyles.optionButton}
                            onPress={() => handleGamepadSelection('Physical Gamepad')}
                        >
                            <View style={authStyles.optionContent}>
                                <Text style={authStyles.optionIcon}>🎮</Text>
                                <Text style={authStyles.optionTitle}>Physical Gamepad</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={authStyles.optionButton}
                            onPress={() => handleGamepadSelection('Virtual Gamepad')}
                        >
                            <View style={authStyles.optionContent}>
                                <Text style={authStyles.optionIcon}>📱</Text>
                                <Text style={authStyles.optionTitle}>Virtual Gamepad</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={authStyles.optionButton}
                            onPress={() => handleGamepadSelection('Custom Control')}
                        >
                            <View style={authStyles.optionContent}>
                                <Text style={authStyles.optionIcon}>⚙️</Text>
                                <Text style={authStyles.optionTitle}>Custom Control</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity
                        style={authStyles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={authStyles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default GamepadSelectionScreen;
