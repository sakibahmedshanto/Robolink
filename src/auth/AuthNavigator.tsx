import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import GamepadSelectionScreen from './screens/GamepadSelectionScreen';

export type AuthState = 'login' | 'gamepadSelection';

interface AuthNavigatorProps {
    onAuthComplete?: () => void;
    onNavigateToCustomScreen?: () => void;
}

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onAuthComplete, onNavigateToCustomScreen }) => {
    const [authState, setAuthState] = useState<AuthState>('login');

    const handleLoginSuccess = () => {
        setAuthState('gamepadSelection');
    };

    const handleLogout = () => {
        setAuthState('login');
    };

    switch (authState) {
        case 'login':
            return (<LoginScreen onLoginSuccess={handleLoginSuccess} />);
        case 'gamepadSelection':
            return (<GamepadSelectionScreen onLogout={handleLogout} onNavigateToCustomScreen={onNavigateToCustomScreen} />);
        default:
            return (<LoginScreen onLoginSuccess={handleLoginSuccess} />);
    }
};

export default AuthNavigator;
