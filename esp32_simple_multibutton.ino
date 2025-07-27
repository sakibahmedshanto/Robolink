/*
  Simple ESP32 Multi-Button Example
  Demonstrates handling multiple simultaneous button presses
  
  This example focuses on movement combinations:
  - Forward + Right = Move diagonally forward-right
  - Forward + Left = Move diagonally forward-left  
  - Backward + Right = Move diagonally backward-right
  - etc.
*/

#include <WiFi.h>
#include <WiFiUdp.h>

// WiFi settings
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// UDP settings
WiFiUDP udp;
const int udpPort = 1235;
char packetBuffer[255];

// Simple button states
bool forward = false;
bool backward = false;
bool left = false;
bool right = false;
bool buttonA = false;
bool buttonB = false;

void setup() {
  Serial.begin(115200);
  Serial.println("ESP32 Multi-Button Demo");
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.println(WiFi.localIP());
  
  udp.begin(udpPort);
  Serial.printf("Listening on UDP port %d\n", udpPort);
}

void loop() {
  int packetSize = udp.parsePacket();
  if (packetSize) {
    int len = udp.read(packetBuffer, 255);
    if (len > 0) {
      packetBuffer[len] = 0;
      
      // Parse the simple format: "Forward=1,Right=1,Left=0,A=1"
      parseButtons(packetBuffer);
      
      // Process button combinations
      processMovement();
    }
  }
}

void parseButtons(const char* data) {
  // Reset all buttons first
  forward = backward = left = right = buttonA = buttonB = false;
  
  // Simple parsing - look for "ButtonName=1"
  if (strstr(data, "Forward=1")) forward = true;
  if (strstr(data, "Backward=1")) backward = true;
  if (strstr(data, "Left=1")) left = true;
  if (strstr(data, "Right=1")) right = true;
  if (strstr(data, "A=1")) buttonA = true;
  if (strstr(data, "B=1")) buttonB = true;
}

void processMovement() {
  Serial.print("Buttons pressed: ");
  
  // Check for combinations
  if (forward && right) {
    Serial.println("FORWARD + RIGHT - Diagonal movement!");
    // Your robot code here: move forward-right
  }
  else if (forward && left) {
    Serial.println("FORWARD + LEFT - Diagonal movement!");
    // Your robot code here: move forward-left
  }
  else if (backward && right) {
    Serial.println("BACKWARD + RIGHT - Diagonal movement!");
    // Your robot code here: move backward-right
  }
  else if (backward && left) {
    Serial.println("BACKWARD + LEFT - Diagonal movement!");
    // Your robot code here: move backward-left
  }
  else if (forward) {
    Serial.println("FORWARD");
    // Your robot code here: move forward
  }
  else if (backward) {
    Serial.println("BACKWARD");
    // Your robot code here: move backward
  }
  else if (left) {
    Serial.println("LEFT");
    // Your robot code here: turn left
  }
  else if (right) {
    Serial.println("RIGHT");
    // Your robot code here: turn right
  }
  else {
    Serial.println("STOP");
    // Your robot code here: stop all motors
  }
  
  // Handle action buttons independently
  if (buttonA && buttonB) {
    Serial.println("  A + B pressed together!");
  }
  else if (buttonA) {
    Serial.println("  A pressed");
  }
  else if (buttonB) {
    Serial.println("  B pressed");
  }
}
