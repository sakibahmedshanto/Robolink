import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
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
import { StyleSheet } from 'react-native';
import { useBackHandler } from '@react-native-community/hooks';
import { Button } from 'react-native';

interface LoginScreenProps {
    onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<any>();

    const { height } = Dimensions.get('window');

    const handleLogin = async () => {
        setIsLoading(true);
        // Completely dummy login - just simulate loading and go to next screen
        setTimeout(() => {
            setIsLoading(false);
            onLoginSuccess();
        }, 1000);

    };
    
    return (
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
                    <View style={{ height: height * 0.1 }}></View>
                    <View>
                      <TouchableOpacity
                        style={{ paddingHorizontal: 20, paddingVertical: 10, maxWidth: 280, alignItems: 'center', backgroundColor: '#2c2c2cff', borderRadius: 5 }}
                        onPress={() => navigation.navigate('Home')}
                      >
                        <Text style={{ color: "white" }}>Go to Home</Text>
                      </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default LoginScreen;


const authStyles = StyleSheet.create({
  // Common Container Styles
  container: {
    flex: 1,
    backgroundColor: '#170F11',
  },  // Login Screen Styles
  loginContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: '100%', // Ensure full height for proper centering
  },
  loginContent: {
    width: '100%',
    maxWidth: 280, // Even smaller max width
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20, // More compact
  },
  title: {
    fontSize: 20, // Even smaller title
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12, // Even smaller subtitle
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // Form Styles
  form: {
    width: '100%',
    marginBottom: 16, // More compact
  },
  inputContainer: {
    marginBottom: 12, // More compact
  },
  label: {
    fontSize: 11, // Smaller label
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4, // More compact
  },
  input: {
    backgroundColor: '#1f181aff',
    borderRadius: 4, // Smaller border radius
    padding: 10, // More compact padding
    fontSize: 13, // Smaller font
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#334155',
    height: 40, // Fixed compact height
  },
  loginButton: {
    backgroundColor: '#D72638',
    borderRadius: 4, // Smaller border radius
    padding: 10, // More compact padding
    alignItems: 'center',
    marginTop: 8, // More compact margin
    width: '100%',
    height: 36, // Slim height
  },
  loginButtonDisabled: {
    backgroundColor: '#7F1D1D',
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 13, // Smaller font
    fontWeight: '600',
  },

  // Footer Styles
  footer: {
    alignItems: 'center',
    marginTop: 16, // More compact
  },
  footerText: {
    fontSize: 11, // Smaller font
    color: '#9CA3AF',
  },
  footerLink: {
    color: '#D72638',
    fontWeight: '600',
  },
});
