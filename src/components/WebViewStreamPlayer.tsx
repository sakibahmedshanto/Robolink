import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Text, TextInput } from 'react-native';

interface WebViewStreamPlayerProps {
  streamUrl?: string;
  ipAddress?: string; // Option to override the hardcoded IP
}

const WebViewStreamPlayer: React.FC<WebViewStreamPlayerProps> = ({ 
  streamUrl,
  ipAddress
}) => {
  // State for the IP input
  const [ip, setIp] = useState(ipAddress || '192.168.0.128');
  // Use streamUrl if provided, otherwise build from ip or fallback to default
  const url = streamUrl || `http://${ip}:81/stream`;

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Unable to load camera stream</Text>
      <Text style={styles.errorSubtext}>Check camera connection and network</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>IP:</Text>
        <TextInput
          style={styles.input}
          value={ip}
          onChangeText={setIp}
          placeholder="Enter IP address"
          placeholderTextColor="#888"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <WebView 
        source={{ uri: url }}
        style={styles.webview}
        renderError={renderError}
        startInLoadingState={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        scalesPageToFit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#111',
    zIndex: 2,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default WebViewStreamPlayer;
