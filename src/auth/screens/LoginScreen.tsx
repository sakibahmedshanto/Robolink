import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
} from 'react-native';
import { authStyles } from '../styles/authStyles';

interface LoginScreenProps {
    onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { height } = Dimensions.get('window');

    const handleLogin = async () => {
        setIsLoading(true);

        // Completely dummy login - just simulate loading and go to next screen
        setTimeout(() => {
            setIsLoading(false);
            onLoginSuccess();
        }, 1000);
    }; return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 48, // Add top padding
                        paddingBottom: 24,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={authStyles.loginContent}>
                        {/* Header */}
                        <View style={authStyles.header}>
                            <Text style={authStyles.title}>Robolink</Text>
                            <Text style={authStyles.subtitle}>Sign in to your account</Text>
                        </View>
                        {/* Form */}
                        <View style={authStyles.form}>
                            <View style={authStyles.inputContainer}>
                                <Text style={authStyles.label}>Email</Text>
                                <TextInput
                                    style={authStyles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            <View style={authStyles.inputContainer}>
                                <Text style={authStyles.label}>Password</Text>
                                <TextInput
                                    style={authStyles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            <TouchableOpacity
                                style={[
                                    authStyles.loginButton,
                                    isLoading && authStyles.loginButtonDisabled,
                                ]}
                                onPress={handleLogin}
                                disabled={isLoading}
                            >
                                <Text style={authStyles.loginButtonText}>
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={authStyles.footer}>
                            <Text style={authStyles.footerText}>
                                Don't have an account?{' '}
                                <Text style={authStyles.footerLink}>Sign up</Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default LoginScreen;
