/**
 * Help Modal component for the Custom Joystick Screen
 * Provides documentation, sample code, and copy functionality for Arduino/ESP32
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    StyleSheet,
    Alert,
    Clipboard,
    SafeAreaView,
    Dimensions,
} from 'react-native';

interface HelpModalProps {
    visible: boolean;
    onClose: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

const HelpModal: React.FC<HelpModalProps> = ({ visible, onClose }) => {
    const [selectedTab, setSelectedTab] = useState<'guide' | 'arduino' | 'esp32' | 'car'>('guide');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (visible) {
            // Small delay to ensure proper initialization
            const timer = setTimeout(() => {
                setIsReady(true);
            }, 50);
            return () => clearTimeout(timer);
        } else {
            setIsReady(false);
        }
    }, [visible]);

    const copyToClipboard = (text: string, label: string) => {
        Clipboard.setString(text);
        Alert.alert('Copied!', `${label} code copied to clipboard`);
    };

    const basicCarCode = `
/*
 * Basic Car with Horn - Arduino/ESP32 Example
 * Simple car control with movement and horn functionality
 */

// Motor pins (adjust for your motor driver)
#define MOTOR_LEFT_FORWARD 2
#define MOTOR_LEFT_BACKWARD 3
#define MOTOR_RIGHT_FORWARD 4
#define MOTOR_RIGHT_BACKWARD 5
#define HORN_PIN 6

// Speed control pins (PWM)
#define LEFT_SPEED_PIN 9
#define RIGHT_SPEED_PIN 10

// Current speed (0-255)
int currentSpeed = 150;

void setup() {
  Serial.begin(115200);
  
  // Initialize motor pins
  pinMode(MOTOR_LEFT_FORWARD, OUTPUT);
  pinMode(MOTOR_LEFT_BACKWARD, OUTPUT);
  pinMode(MOTOR_RIGHT_FORWARD, OUTPUT);
  pinMode(MOTOR_RIGHT_BACKWARD, OUTPUT);
  pinMode(HORN_PIN, OUTPUT);
  
  // Initialize PWM pins
  pinMode(LEFT_SPEED_PIN, OUTPUT);
  pinMode(RIGHT_SPEED_PIN, OUTPUT);
  
  // Start with motors stopped
  stopCar();
  
  Serial.println("Basic Car with Horn initialized!");
  Serial.println("Commands: forward:100, backward:100, left:100, right:100, horn:1, speed:150");
}

void loop() {
  // Check for serial commands (replace with UDP/Bluetooth as needed)
  if (Serial.available()) {
    String command = Serial.readStringUntil('\\n');
    command.trim();
    handleCommand(command);
  }
}

void handleCommand(String command) {
  int colonIndex = command.indexOf(':');
  if (colonIndex <= 0) return;
  
  String mapName = command.substring(0, colonIndex);
  int value = command.substring(colonIndex + 1).toInt();
  
  Serial.println("Command: " + mapName + " = " + value);
  
  if (mapName == "forward") {
    moveForward();
  } else if (mapName == "backward") {
    moveBackward();
  } else if (mapName == "left") {
    turnLeft();
  } else if (mapName == "right") {
    turnRight();
  } else if (mapName == "horn") {
    if (value > 0) activateHorn();
  } else if (mapName == "speed") {
    setSpeed(value);
  } else {
    stopCar(); // Stop for any other command
  }
}

void moveForward() {
  Serial.println("Moving forward");
  
  // Set motor directions
  digitalWrite(MOTOR_LEFT_FORWARD, HIGH);
  digitalWrite(MOTOR_LEFT_BACKWARD, LOW);
  digitalWrite(MOTOR_RIGHT_FORWARD, HIGH);
  digitalWrite(MOTOR_RIGHT_BACKWARD, LOW);
  
  // Set speed
  analogWrite(LEFT_SPEED_PIN, currentSpeed);
  analogWrite(RIGHT_SPEED_PIN, currentSpeed);
}

void moveBackward() {
  Serial.println("Moving backward");
  
  // Set motor directions
  digitalWrite(MOTOR_LEFT_FORWARD, LOW);
  digitalWrite(MOTOR_LEFT_BACKWARD, HIGH);
  digitalWrite(MOTOR_RIGHT_FORWARD, LOW);
  digitalWrite(MOTOR_RIGHT_BACKWARD, HIGH);
  
  // Set speed
  analogWrite(LEFT_SPEED_PIN, currentSpeed);
  analogWrite(RIGHT_SPEED_PIN, currentSpeed);
}

void turnLeft() {
  Serial.println("Turning left");
  
  // Left motor backward, right motor forward
  digitalWrite(MOTOR_LEFT_FORWARD, LOW);
  digitalWrite(MOTOR_LEFT_BACKWARD, HIGH);
  digitalWrite(MOTOR_RIGHT_FORWARD, HIGH);
  digitalWrite(MOTOR_RIGHT_BACKWARD, LOW);
  
  // Set speed
  analogWrite(LEFT_SPEED_PIN, currentSpeed);
  analogWrite(RIGHT_SPEED_PIN, currentSpeed);
}

void turnRight() {
  Serial.println("Turning right");
  
  // Left motor forward, right motor backward
  digitalWrite(MOTOR_LEFT_FORWARD, HIGH);
  digitalWrite(MOTOR_LEFT_BACKWARD, LOW);
  digitalWrite(MOTOR_RIGHT_FORWARD, LOW);
  digitalWrite(MOTOR_RIGHT_BACKWARD, HIGH);
  
  // Set speed
  analogWrite(LEFT_SPEED_PIN, currentSpeed);
  analogWrite(RIGHT_SPEED_PIN, currentSpeed);
}

void stopCar() {
  Serial.println("Stopping car");
  
  // Stop all motors
  digitalWrite(MOTOR_LEFT_FORWARD, LOW);
  digitalWrite(MOTOR_LEFT_BACKWARD, LOW);
  digitalWrite(MOTOR_RIGHT_FORWARD, LOW);
  digitalWrite(MOTOR_RIGHT_BACKWARD, LOW);
  
  // Set speed to 0
  analogWrite(LEFT_SPEED_PIN, 0);
  analogWrite(RIGHT_SPEED_PIN, 0);
}

void activateHorn() {
  Serial.println("BEEP BEEP! Horn activated!");
  
  // Simple horn pattern - 3 short beeps
  for (int i = 0; i < 3; i++) {
    digitalWrite(HORN_PIN, HIGH);
    delay(200);
    digitalWrite(HORN_PIN, LOW);
    delay(100);
  }
}

void setSpeed(int speed) {
  // Limit speed to safe range (0-255)
  currentSpeed = constrain(speed, 0, 255);
  Serial.println("Speed set to: " + String(currentSpeed));
}

/*
 * Wiring Guide:
 * 
 * Motor Driver (L298N example):
 * - IN1 -> Pin 2 (MOTOR_LEFT_FORWARD)
 * - IN2 -> Pin 3 (MOTOR_LEFT_BACKWARD)  
 * - IN3 -> Pin 4 (MOTOR_RIGHT_FORWARD)
 * - IN4 -> Pin 5 (MOTOR_RIGHT_BACKWARD)
 * - ENA -> Pin 9 (LEFT_SPEED_PIN)
 * - ENB -> Pin 10 (RIGHT_SPEED_PIN)
 * 
 * Horn:
 * - Buzzer + -> Pin 6 (HORN_PIN)
 * - Buzzer - -> GND
 * 
 * Power:
 * - Connect motor driver to external battery (7-12V)
 * - Connect Arduino/ESP32 to USB or battery
 * - Common ground between Arduino and motor driver
 */
  `.trim();

    const arduinoUdpCode = `
/*
 * Arduino UDP Receiver for Custom Joystick
 * Receives joystick commands via WiFi UDP
 */
#include <WiFi.h>
#include <WiFiUdp.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WiFiUDP udp;
unsigned int localUdpPort = 4210;  // Default port
char incomingPacket[255];
char replyPacket[] = "ACK";

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Start UDP
  udp.begin(localUdpPort);
  Serial.printf("UDP server started at port %d\\n", localUdpPort);
}

void loop() {
  int packetSize = udp.parsePacket();
  if (packetSize) {
    // Read the packet
    int len = udp.read(incomingPacket, 255);
    if (len > 0) {
      incomingPacket[len] = 0;
    }
    
    // Parse command: "mapName:value"
    String command = String(incomingPacket);
    int colonIndex = command.indexOf(':');
    
    if (colonIndex > 0) {
      String mapName = command.substring(0, colonIndex);
      int value = command.substring(colonIndex + 1).toInt();
      
      // Handle different commands
      handleCommand(mapName, value);
    }
    
    // Send acknowledgment
    udp.beginPacket(udp.remoteIP(), udp.remotePort());
    udp.write(replyPacket);
    udp.endPacket();
  }
}

void handleCommand(String mapName, int value) {
  Serial.println("Command: " + mapName + " = " + value);
  
  // Movement commands
  if (mapName == "forward") {
    moveForward(value);
  } else if (mapName == "backward") {
    moveBackward(value);
  } else if (mapName == "left") {
    turnLeft(value);
  } else if (mapName == "right") {
    turnRight(value);
  } else if (mapName == "stop") {
    stopMotors();
  }
  
  // Action commands
  else if (mapName == "fire") {
    if (value > 0) activateFire();
  } else if (mapName == "lights") {
    if (value > 0) toggleLights();
  } else if (mapName == "horn") {
    if (value > 0) activateHorn();
  }
  
  // Control commands
  else if (mapName == "speed") {
    setSpeed(value);
  } else if (mapName == "steering") {
    setSteering(value);
  }
}

// Motor control functions (customize for your hardware)
void moveForward(int speed) {
  // Your motor control code here
  Serial.println("Moving forward at speed: " + String(speed));
}

void moveBackward(int speed) {
  // Your motor control code here
  Serial.println("Moving backward at speed: " + String(speed));
}

void turnLeft(int speed) {
  // Your turning code here
  Serial.println("Turning left at speed: " + String(speed));
}

void turnRight(int speed) {
  // Your turning code here
  Serial.println("Turning right at speed: " + String(speed));
}

void stopMotors() {
  // Stop all motors
  Serial.println("Stopping motors");
}

void activateFire() {
  // Your fire mechanism code
  Serial.println("Fire activated!");
}

void toggleLights() {
  // Toggle lights
  Serial.println("Lights toggled");
}

void activateHorn() {
  // Activate horn
  Serial.println("Horn activated");
}

void setSpeed(int speed) {
  // Set global speed
  Serial.println("Speed set to: " + String(speed));
}

void setSteering(int angle) {
  // Set steering angle
  Serial.println("Steering angle: " + String(angle));
}
  `.trim();

    const esp32BluetoothCode = `
/*
 * ESP32 Bluetooth Classic Receiver for Custom Joystick
 * Receives joystick commands via Bluetooth
 */
#include "BluetoothSerial.h"

BluetoothSerial SerialBT;
String deviceName = "ESP32_Robot";

void setup() {
  Serial.begin(115200);
  
  // Initialize Bluetooth
  SerialBT.begin(deviceName);
  Serial.printf("Device '%s' started. You can pair it with bluetooth!\\n", deviceName.c_str());
  
  // Initialize your hardware here
  setupMotors();
  setupSensors();
}

void loop() {
  if (SerialBT.available()) {
    String command = SerialBT.readStringUntil('\\n');
    command.trim();
    
    // Parse command: "mapName:value"
    int colonIndex = command.indexOf(':');
    
    if (colonIndex > 0) {
      String mapName = command.substring(0, colonIndex);
      int value = command.substring(colonIndex + 1).toInt();
      
      // Handle different commands
      handleBluetoothCommand(mapName, value);
      
      // Send acknowledgment
      SerialBT.println("ACK:" + mapName + ":" + value);
    }
  }
  
  // Your main loop code here
  delay(10);
}

void handleBluetoothCommand(String mapName, int value) {
  Serial.println("BT Command: " + mapName + " = " + value);
  
  // Movement commands
  if (mapName == "forward") {
    driveForward(value);
  } else if (mapName == "backward") {
    driveBackward(value);
  } else if (mapName == "left") {
    rotateLeft(value);
  } else if (mapName == "right") {
    rotateRight(value);
  } else if (mapName == "stop") {
    emergencyStop();
  }
  
  // Action commands
  else if (mapName == "fire") {
    triggerAction(value > 0);
  } else if (mapName == "grab") {
    controlGripper(value > 0);
  } else if (mapName == "release") {
    releaseGripper();
  } else if (mapName == "lights") {
    controlLights(value > 0);
  } else if (mapName == "horn") {
    playHorn(value > 0);
  }
  
  // Analog controls
  else if (mapName == "speed") {
    setGlobalSpeed(value);
  } else if (mapName == "steering") {
    adjustSteering(value);
  } else if (mapName == "throttle") {
    setThrottle(value);
  }
}

// Hardware setup functions
void setupMotors() {
  // Initialize motor pins and settings
  Serial.println("Motors initialized");
}

void setupSensors() {
  // Initialize sensors
  Serial.println("Sensors initialized");
}

// Movement functions
void driveForward(int power) {
  Serial.println("Driving forward with power: " + String(power));
  // Your motor control code
}

void driveBackward(int power) {
  Serial.println("Driving backward with power: " + String(power));
  // Your motor control code
}

void rotateLeft(int power) {
  Serial.println("Rotating left with power: " + String(power));
  // Your rotation code
}

void rotateRight(int power) {
  Serial.println("Rotating right with power: " + String(power));
  // Your rotation code
}

void emergencyStop() {
  Serial.println("Emergency stop activated!");
  // Stop all motors immediately
}

// Action functions
void triggerAction(bool activate) {
  Serial.println("Action trigger: " + String(activate ? "ON" : "OFF"));
  // Your action mechanism
}

void controlGripper(bool grab) {
  Serial.println("Gripper: " + String(grab ? "GRAB" : "RELEASE"));
  // Your gripper control
}

void releaseGripper() {
  Serial.println("Gripper released");
  // Release gripper mechanism
}

void controlLights(bool on) {
  Serial.println("Lights: " + String(on ? "ON" : "OFF"));
  // Control lighting system
}

void playHorn(bool activate) {
  if (activate) {
    Serial.println("Horn activated!");
    // Play horn sound/activate buzzer
  }
}

// Analog control functions
void setGlobalSpeed(int speed) {
  Serial.println("Global speed set to: " + String(speed) + "%");
  // Adjust overall speed multiplier
}

void adjustSteering(int angle) {
  Serial.println("Steering adjusted to: " + String(angle));
  // Control steering mechanism
}

void setThrottle(int throttle) {
  Serial.println("Throttle set to: " + String(throttle) + "%");
  // Control throttle/acceleration
}
  `.trim();    const renderGuideContent = () => (
        <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.content}>
                <View style={styles.headerContainer}>
                    <Text style={styles.sectionTitle}>🎮 Custom Joystick Help</Text>
                    <Text style={styles.sectionSubtitle}>Complete guide to creating custom controls</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitle}>📱 How to Use</Text>
                    <View style={styles.stepContainer}>
                        <View style={styles.step}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>1</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Add Buttons</Text>
                                <Text style={styles.stepDescription}>Tap the "+" button to create new controls</Text>
                            </View>
                        </View>
                        
                        <View style={styles.step}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>2</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Select Type</Text>
                                <Text style={styles.stepDescription}>Choose Direction (↑), Action (●), or Slider (═)</Text>
                            </View>
                        </View>

                        <View style={styles.step}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>3</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Configure</Text>
                                <Text style={styles.stepDescription}>Set label, map name, value, size, and color</Text>
                            </View>
                        </View>

                        <View style={styles.step}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>4</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Position</Text>
                                <Text style={styles.stepDescription}>Drag buttons to arrange your layout</Text>
                            </View>
                        </View>

                        <View style={styles.step}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>5</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>Save</Text>
                                <Text style={styles.stepDescription}>Save your custom layout for later use</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitle}>🗺️ Map Names Reference</Text>
                    <View style={styles.mapSection}>
                        <Text style={styles.mapCategory}>Movement Controls</Text>
                        <View style={styles.mapList}>
                            <Text style={styles.mapItem}>• forward, backward, left, right</Text>
                            <Text style={styles.mapItem}>• up, down, rotate_left, rotate_right</Text>
                        </View>
                    </View>
                    
                    <View style={styles.mapSection}>
                        <Text style={styles.mapCategory}>Action Controls</Text>
                        <View style={styles.mapList}>
                            <Text style={styles.mapItem}>• fire, grab, release, horn</Text>
                            <Text style={styles.mapItem}>• lights, camera, brake, turbo</Text>
                        </View>
                    </View>
                    
                    <View style={styles.mapSection}>
                        <Text style={styles.mapCategory}>Variable Controls</Text>
                        <View style={styles.mapList}>
                            <Text style={styles.mapItem}>• speed, steering, throttle</Text>
                            <Text style={styles.mapItem}>• brake_intensity, volume, brightness</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitle}>📡 Data Format</Text>
                    <Text style={styles.text}>
                        Commands are sent in the format: <Text style={styles.code}>mapName:value</Text>
                    </Text>
                    <View style={styles.exampleContainer}>
                        <Text style={styles.exampleTitle}>Examples:</Text>
                        <View style={styles.exampleItem}>
                            <Text style={styles.exampleCode}>forward:100</Text>
                            <Text style={styles.exampleDescription}>Move forward at full speed</Text>
                        </View>
                        <View style={styles.exampleItem}>
                            <Text style={styles.exampleCode}>fire:1</Text>
                            <Text style={styles.exampleDescription}>Activate fire mechanism</Text>
                        </View>
                        <View style={styles.exampleItem}>
                            <Text style={styles.exampleCode}>speed:75</Text>
                            <Text style={styles.exampleDescription}>Set speed to 75%</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitle}>🔧 Hardware Setup</Text>
                    <View style={styles.setupSteps}>
                        <Text style={styles.setupStep}>1. Connect your Arduino/ESP32 to WiFi (UDP) or enable Bluetooth</Text>
                        <Text style={styles.setupStep}>2. Use the sample code in the Arduino/ESP32 tabs</Text>
                        <Text style={styles.setupStep}>3. Customize the command handlers for your specific hardware</Text>
                        <Text style={styles.setupStep}>4. Test commands using the Serial Monitor</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitle}>⚡ Tips & Best Practices</Text>
                    <View style={styles.tipContainer}>
                        <View style={styles.tip}>
                            <Text style={styles.tipIcon}>💡</Text>
                            <Text style={styles.tipText}>Use <Text style={styles.bold}>Direction buttons</Text> for movement controls</Text>
                        </View>
                        <View style={styles.tip}>
                            <Text style={styles.tipIcon}>🎯</Text>
                            <Text style={styles.tipText}>Use <Text style={styles.bold}>Action buttons</Text> for on/off functions</Text>
                        </View>
                        <View style={styles.tip}>
                            <Text style={styles.tipIcon}>🎚️</Text>
                            <Text style={styles.tipText}>Use <Text style={styles.bold}>Sliders</Text> for variable controls (speed, angle)</Text>
                        </View>
                        <View style={styles.tip}>
                            <Text style={styles.tipIcon}>🎮</Text>
                            <Text style={styles.tipText}>Arrange buttons in a gamepad-like layout for best experience</Text>
                        </View>
                        <View style={styles.tip}>
                            <Text style={styles.tipIcon}>🧪</Text>
                            <Text style={styles.tipText}>Test your layout before saving to ensure it works as expected</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );

    const renderCodeContent = (code: string, title: string) => (
        <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.content}>
                <View style={styles.codeHeader}>
                    <View>
                        <Text style={styles.codeTitle}>{title}</Text>
                        <Text style={styles.codeSubtitle}>Copy and customize for your project</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() => copyToClipboard(code, title)}
                    >
                        <Text style={styles.copyButtonText}>📋 Copy Code</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.codeContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <Text style={styles.codeText}>{code}</Text>
                    </ScrollView>
                </View>
            </View>
        </ScrollView>
    );

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={false}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.tabContainer}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabScrollContent}
                    >
                        <TouchableOpacity
                            style={[styles.tab, selectedTab === 'guide' && styles.tabActive]}
                            onPress={() => setSelectedTab('guide')}
                        >
                            <Text style={[styles.tabText, selectedTab === 'guide' && styles.tabTextActive]}>
                                📖 Guide
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, selectedTab === 'arduino' && styles.tabActive]}
                            onPress={() => setSelectedTab('arduino')}
                        >
                            <Text style={[styles.tabText, selectedTab === 'arduino' && styles.tabTextActive]}>
                                🔌 Arduino UDP
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, selectedTab === 'esp32' && styles.tabActive]}
                            onPress={() => setSelectedTab('esp32')}
                        >
                            <Text style={[styles.tabText, selectedTab === 'esp32' && styles.tabTextActive]}>
                                📶 ESP32 Bluetooth
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, selectedTab === 'car' && styles.tabActive]}
                            onPress={() => setSelectedTab('car')}
                        >
                            <Text style={[styles.tabText, selectedTab === 'car' && styles.tabTextActive]}>
                                🚗 Basic Car
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tabContentContainer}>
                    {isReady && selectedTab === 'guide' && <View key="guide" style={{ flex: 1 }}>{renderGuideContent()}</View>}
                    {isReady && selectedTab === 'arduino' && <View key="arduino" style={{ flex: 1 }}>{renderCodeContent(arduinoUdpCode, 'Arduino UDP Code')}</View>}
                    {isReady && selectedTab === 'esp32' && <View key="esp32" style={{ flex: 1 }}>{renderCodeContent(esp32BluetoothCode, 'ESP32 Bluetooth Code')}</View>}
                    {isReady && selectedTab === 'car' && <View key="car" style={{ flex: 1 }}>{renderCodeContent(basicCarCode, 'Basic Car with Horn')}</View>}
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    tabScrollContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#2a2a2a',
        alignItems: 'center',
        minWidth: 100,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    tabActive: {
        backgroundColor: '#2563eb',
        elevation: 4,
        shadowOpacity: 0.3,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
    },
    tabTextActive: {
        color: '#fff',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    tabContentContainer: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100, // Extra space at bottom for comfortable reading
    },
    content: {
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
        paddingVertical: 16,
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    sectionSubtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    section: {
        marginBottom: 32,
        backgroundColor: '#151515',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 16,
        textAlign: 'left',
    },
    text: {
        fontSize: 15,
        color: '#ccc',
        lineHeight: 24,
        marginBottom: 12,
    },
    bold: {
        fontWeight: 'bold',
        color: '#fff',
    },
    code: {
        fontFamily: 'monospace',
        backgroundColor: '#2a2a2a',
        color: '#4ade80',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        fontSize: 14,
    },
    stepContainer: {
        marginTop: 8,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#2563eb',
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    stepNumberText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 14,
        color: '#ccc',
        lineHeight: 20,
    },
    mapSection: {
        marginBottom: 16,
    },
    mapCategory: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4ade80',
        marginBottom: 8,
    },
    mapList: {
        paddingLeft: 16,
    },
    mapItem: {
        fontSize: 14,
        color: '#ccc',
        lineHeight: 22,
        marginBottom: 4,
    },
    exampleContainer: {
        marginTop: 12,
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        padding: 16,
    },
    exampleTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    exampleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    exampleCode: {
        fontFamily: 'monospace',
        backgroundColor: '#2a2a2a',
        color: '#4ade80',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        fontSize: 14,
        minWidth: 100,
        textAlign: 'center',
        marginRight: 12,
    },
    exampleDescription: {
        flex: 1,
        fontSize: 14,
        color: '#ccc',
    },
    setupSteps: {
        marginTop: 8,
    },
    setupStep: {
        fontSize: 15,
        color: '#ccc',
        lineHeight: 24,
        marginBottom: 12,
        paddingLeft: 16,
        position: 'relative',
    },
    tipContainer: {
        marginTop: 8,
    },
    tip: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#4ade80',
    },
    tipIcon: {
        fontSize: 20,
        marginRight: 12,
        marginTop: 2,
    },
    tipText: {
        flex: 1,
        fontSize: 15,
        color: '#ccc',
        lineHeight: 22,
    },
    codeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    codeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    codeSubtitle: {
        fontSize: 14,
        color: '#888',
        fontStyle: 'italic',
    },
    copyButton: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    copyButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    codeContainer: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    codeText: {
        fontFamily: 'monospace',
        fontSize: 13,
        color: '#4ade80',
        padding: 20,
        lineHeight: 20,
        minWidth: '100%',
    },
});

export default HelpModal;