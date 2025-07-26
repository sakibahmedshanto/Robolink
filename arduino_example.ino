/*
  Arduino/ESP32 Example - Parsing Simple Gamepad Data
  
  This example shows how to parse the new simple gamepad format:
  "LX=0.5,RY=-0.8,A=1,B=0"
  
  Much easier than JSON parsing on microcontrollers!
*/

#include <WiFi.h>
#include <WiFiUdp.h>

WiFiUDP udp;
unsigned int localUdpPort = 1234;  // Must match port in your React Native app
char incomingPacket[255];  // Buffer for incoming packets

// Gamepad state variables
float leftX = 0, leftY = 0, rightX = 0, rightY = 0;
float leftTrigger = 0, rightTrigger = 0;
bool buttonA = false, buttonB = false, buttonX = false, buttonY = false;

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin("your_wifi_ssid", "your_wifi_password");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  // Start UDP
  udp.begin(localUdpPort);
  Serial.printf("UDP listening on port %d\n", localUdpPort);
}

void loop() {
  // Check for incoming UDP packets
  int packetSize = udp.parsePacket();
  if (packetSize) {
    // Read the packet
    int len = udp.read(incomingPacket, 255);
    if (len > 0) {
      incomingPacket[len] = 0;  // Null terminate
      
      // Parse the simple format: "LX=0.5,RY=-0.8,A=1,B=0"
      parseGamepadData(String(incomingPacket));
      
      // Use the parsed data for robot control
      controlRobot();
    }
  }
  
  delay(10);
}

void parseGamepadData(String data) {
  // Split by comma to get individual key=value pairs
  int startIndex = 0;
  int commaIndex = data.indexOf(',');
  
  while (commaIndex != -1 || startIndex < data.length()) {
    String pair;
    if (commaIndex != -1) {
      pair = data.substring(startIndex, commaIndex);
      startIndex = commaIndex + 1;
      commaIndex = data.indexOf(',', startIndex);
    } else {
      pair = data.substring(startIndex);
      startIndex = data.length();
    }
    
    // Split each pair by '=' to get key and value
    int equalIndex = pair.indexOf('=');
    if (equalIndex != -1) {
      String key = pair.substring(0, equalIndex);
      float value = pair.substring(equalIndex + 1).toFloat();
      
      // Update gamepad state based on key
      updateGamepadValue(key, value);
    }
  }
}

void updateGamepadValue(String key, float value) {
  // Map keys to gamepad state variables
  if (key == "LX") leftX = value;
  else if (key == "LY") leftY = value;
  else if (key == "RX") rightX = value;
  else if (key == "RY") rightY = value;
  else if (key == "LT") leftTrigger = value;
  else if (key == "RT") rightTrigger = value;
  else if (key == "A") buttonA = (value > 0);
  else if (key == "B") buttonB = (value > 0);
  else if (key == "X") buttonX = (value > 0);
  else if (key == "Y") buttonY = (value > 0);
  
  // Debug output
  Serial.printf("%s = %.3f\n", key.c_str(), value);
}

void controlRobot() {
  // Example robot control using gamepad inputs
  
  // Tank drive using left stick
  float leftMotor = leftY + leftX;   // Forward/backward + turning
  float rightMotor = leftY - leftX;
  
  // Constrain motor values
  leftMotor = constrain(leftMotor, -1.0, 1.0);
  rightMotor = constrain(rightMotor, -1.0, 1.0);
  
  // Convert to PWM (0-255)
  int leftPWM = abs(leftMotor) * 255;
  int rightPWM = abs(rightMotor) * 255;
  
  // Set motor directions and speeds
  // (Replace with your actual motor control code)
  if (leftMotor > 0) {
    // Left motor forward
    digitalWrite(LEFT_MOTOR_DIR, HIGH);
  } else {
    // Left motor backward
    digitalWrite(LEFT_MOTOR_DIR, LOW);
  }
  analogWrite(LEFT_MOTOR_PWM, leftPWM);
  
  if (rightMotor > 0) {
    // Right motor forward
    digitalWrite(RIGHT_MOTOR_DIR, HIGH);
  } else {
    // Right motor backward
    digitalWrite(RIGHT_MOTOR_DIR, LOW);
  }
  analogWrite(RIGHT_MOTOR_PWM, rightPWM);
  
  // Handle buttons for special functions
  if (buttonA) {
    // Activate LED or servo
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
  
  if (buttonB) {
    // Emergency stop
    analogWrite(LEFT_MOTOR_PWM, 0);
    analogWrite(RIGHT_MOTOR_PWM, 0);
  }
}

// Pin definitions (adjust for your hardware)
#define LEFT_MOTOR_PWM 5
#define LEFT_MOTOR_DIR 18
#define RIGHT_MOTOR_PWM 19
#define RIGHT_MOTOR_DIR 21
#define LED_PIN 2
