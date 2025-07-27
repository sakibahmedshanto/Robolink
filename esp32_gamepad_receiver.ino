/*
  ESP32 Multi-Button Gamepad Receiver
  Receives gamepad data from React Native app via UDP
  Handles multiple simultaneous button presses efficiently
  
  Data format: "Forward=1,Right=1,Left=0,A=1,B=0,LX=0.500,RY=-0.800"
  
  Hardware connections:
  - LED on pin 2 for status indication
  - Motor driver pins (adjust as needed)
  - Serial output for debugging
*/

#include <WiFi.h>
#include <WiFiUdp.h>
#include <string.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// UDP settings
WiFiUDP udp;
const int udpPort = 1235;  // Same port as React Native app
char packetBuffer[255];    // Buffer for incoming packets

// Pin definitions (adjust according to your hardware)
#define STATUS_LED 2
#define MOTOR_LEFT_FORWARD 4
#define MOTOR_LEFT_BACKWARD 5
#define MOTOR_RIGHT_FORWARD 6
#define MOTOR_RIGHT_BACKWARD 7

// Button states - updated from UDP data
struct GamepadState {
  // Movement buttons
  bool forward = false;
  bool backward = false;
  bool left = false;
  bool right = false;
  
  // Action buttons
  bool buttonA = false;
  bool buttonB = false;
  bool buttonX = false;
  bool buttonY = false;
  
  // Analog sticks (-1000 to 1000)
  int leftStickX = 0;
  int leftStickY = 0;
  int rightStickX = 0;
  int rightStickY = 0;
  
  // Triggers (0 to 1000)
  int leftTrigger = 0;
  int rightTrigger = 0;
};

GamepadState gamepad;
unsigned long lastPacketTime = 0;
const unsigned long PACKET_TIMEOUT = 1000; // Stop if no data for 1 second

void setup() {
  Serial.begin(115200);
  Serial.println("ESP32 Multi-Button Gamepad Receiver Starting...");
  
  // Initialize pins
  pinMode(STATUS_LED, OUTPUT);
  pinMode(MOTOR_LEFT_FORWARD, OUTPUT);
  pinMode(MOTOR_LEFT_BACKWARD, OUTPUT);
  pinMode(MOTOR_RIGHT_FORWARD, OUTPUT);
  pinMode(MOTOR_RIGHT_BACKWARD, OUTPUT);
  
  // Initialize WiFi
  WiFi.begin(ssid, password);
  
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    digitalWrite(STATUS_LED, !digitalRead(STATUS_LED)); // Blink while connecting
  }
  
  Serial.println();
  Serial.print("WiFi connected! IP address: ");
  Serial.println(WiFi.localIP());
  
  // Start UDP
  udp.begin(udpPort);
  Serial.printf("UDP server started on port %d\n", udpPort);
  
  digitalWrite(STATUS_LED, HIGH); // Solid LED when ready
}

void loop() {
  // Check for UDP packets
  int packetSize = udp.parsePacket();
  if (packetSize) {
    lastPacketTime = millis();
    
    // Read the packet
    int len = udp.read(packetBuffer, 255);
    if (len > 0) {
      packetBuffer[len] = 0; // Null terminate
      
      Serial.printf("Received packet: %s\n", packetBuffer);
      
      // Parse the gamepad data
      parseGamepadData(packetBuffer);
      
      // Process the commands
      processGamepadCommands();
    }
  }
  
  // Check for timeout
  if (millis() - lastPacketTime > PACKET_TIMEOUT && lastPacketTime > 0) {
    Serial.println("Packet timeout - stopping all motors");
    stopAllMotors();
    gamepad = GamepadState(); // Reset to default state
  }
  
  delay(10); // Small delay for stability
}

void parseGamepadData(const char* data) {
  // Parse format: "Forward=1,Right=1,Left=0,A=1,LX=500"
  char* dataCopy = strdup(data); // Make a copy since strtok modifies the string
  char* token = strtok(dataCopy, ",");
  
  while (token != NULL) {
    char* equals = strchr(token, '=');
    if (equals != NULL) {
      *equals = '\0'; // Split at '='
      char* key = token;
      char* value = equals + 1;
      
      // Parse buttons (1 = pressed, 0 = released)
      if (strcmp(key, "Forward") == 0) {
        gamepad.forward = (atoi(value) == 1);
      }
      else if (strcmp(key, "Backward") == 0) {
        gamepad.backward = (atoi(value) == 1);
      }
      else if (strcmp(key, "Left") == 0) {
        gamepad.left = (atoi(value) == 1);
      }
      else if (strcmp(key, "Right") == 0) {
        gamepad.right = (atoi(value) == 1);
      }
      else if (strcmp(key, "A") == 0) {
        gamepad.buttonA = (atoi(value) == 1);
      }
      else if (strcmp(key, "B") == 0) {
        gamepad.buttonB = (atoi(value) == 1);
      }
      else if (strcmp(key, "X") == 0) {
        gamepad.buttonX = (atoi(value) == 1);
      }
      else if (strcmp(key, "Y") == 0) {
        gamepad.buttonY = (atoi(value) == 1);
      }
      // Parse analog values
      else if (strcmp(key, "LX") == 0) {
        gamepad.leftStickX = (int)(atof(value) * 1000); // Convert to -1000 to 1000
      }
      else if (strcmp(key, "LY") == 0) {
        gamepad.leftStickY = (int)(atof(value) * 1000);
      }
      else if (strcmp(key, "RX") == 0) {
        gamepad.rightStickX = (int)(atof(value) * 1000);
      }
      else if (strcmp(key, "RY") == 0) {
        gamepad.rightStickY = (int)(atof(value) * 1000);
      }
      else if (strcmp(key, "LT") == 0) {
        gamepad.leftTrigger = (int)(atof(value) * 1000);
      }
      else if (strcmp(key, "RT") == 0) {
        gamepad.rightTrigger = (int)(atof(value) * 1000);
      }
    }
    
    token = strtok(NULL, ",");
  }
  
  free(dataCopy);
}

void processGamepadCommands() {
  // Display active buttons for debugging
  Serial.print("Active: ");
  if (gamepad.forward) Serial.print("Forward ");
  if (gamepad.backward) Serial.print("Backward ");
  if (gamepad.left) Serial.print("Left ");
  if (gamepad.right) Serial.print("Right ");
  if (gamepad.buttonA) Serial.print("A ");
  if (gamepad.buttonB) Serial.print("B ");
  Serial.println();
  
  // Handle movement combinations
  handleMovement();
  
  // Handle action buttons
  handleActionButtons();
}

void handleMovement() {
  // Calculate motor speeds based on button combinations
  int leftMotorSpeed = 0;
  int rightMotorSpeed = 0;
  
  // Forward/Backward
  if (gamepad.forward && !gamepad.backward) {
    leftMotorSpeed += 255;
    rightMotorSpeed += 255;
  }
  else if (gamepad.backward && !gamepad.forward) {
    leftMotorSpeed -= 255;
    rightMotorSpeed -= 255;
  }
  
  // Left/Right turning (tank steering)
  if (gamepad.left && !gamepad.right) {
    leftMotorSpeed -= 100;  // Slow down left motor
    rightMotorSpeed += 100; // Speed up right motor
  }
  else if (gamepad.right && !gamepad.left) {
    leftMotorSpeed += 100;  // Speed up left motor
    rightMotorSpeed -= 100; // Slow down right motor
  }
  
  // Constrain speeds
  leftMotorSpeed = constrain(leftMotorSpeed, -255, 255);
  rightMotorSpeed = constrain(rightMotorSpeed, -255, 255);
  
  // Apply motor speeds
  setMotorSpeed(MOTOR_LEFT_FORWARD, MOTOR_LEFT_BACKWARD, leftMotorSpeed);
  setMotorSpeed(MOTOR_RIGHT_FORWARD, MOTOR_RIGHT_BACKWARD, rightMotorSpeed);
  
  // Debug output for combinations
  if (gamepad.forward && gamepad.right) {
    Serial.println("Moving: Forward + Right");
  }
  else if (gamepad.forward && gamepad.left) {
    Serial.println("Moving: Forward + Left");
  }
  else if (gamepad.backward && gamepad.right) {
    Serial.println("Moving: Backward + Right");
  }
  else if (gamepad.backward && gamepad.left) {
    Serial.println("Moving: Backward + Left");
  }
  else if (gamepad.forward) {
    Serial.println("Moving: Forward");
  }
  else if (gamepad.backward) {
    Serial.println("Moving: Backward");
  }
  else if (gamepad.left) {
    Serial.println("Moving: Left");
  }
  else if (gamepad.right) {
    Serial.println("Moving: Right");
  }
}

void handleActionButtons() {
  // Handle action buttons - you can customize these for your specific needs
  
  if (gamepad.buttonA) {
    Serial.println("Action: Button A pressed - LED ON");
    digitalWrite(STATUS_LED, HIGH);
  }
  
  if (gamepad.buttonB) {
    Serial.println("Action: Button B pressed - LED OFF");
    digitalWrite(STATUS_LED, LOW);
  }
  
  // You can add more actions here:
  // if (gamepad.buttonX) { /* servo control */ }
  // if (gamepad.buttonY) { /* sensor reading */ }
}

void setMotorSpeed(int forwardPin, int backwardPin, int speed) {
  if (speed > 0) {
    // Forward direction
    analogWrite(forwardPin, speed);
    digitalWrite(backwardPin, LOW);
  }
  else if (speed < 0) {
    // Backward direction
    digitalWrite(forwardPin, LOW);
    analogWrite(backwardPin, -speed);
  }
  else {
    // Stop
    digitalWrite(forwardPin, LOW);
    digitalWrite(backwardPin, LOW);
  }
}

void stopAllMotors() {
  digitalWrite(MOTOR_LEFT_FORWARD, LOW);
  digitalWrite(MOTOR_LEFT_BACKWARD, LOW);
  digitalWrite(MOTOR_RIGHT_FORWARD, LOW);
  digitalWrite(MOTOR_RIGHT_BACKWARD, LOW);
}
