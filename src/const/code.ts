const esp32CodeForBluetooth = `
#include "BluetoothSerial.h"

#define BUFFER_SIZE 100
BluetoothSerial SerialBT;
char inputString[BUFFER_SIZE];      // Buffer for incoming serial data
int channels[100];
bool messageComplete = false;

void setup() {
  Serial.begin(115200);
  Serial.println("✅ Serial Monitor started");

  SerialBT.begin("ESP32_BT"); // Bluetooth name
  Serial.println("📶 Bluetooth started. Pair with 'ESP32_BT'");
}


void loop() {
  if (SerialBT.available()) {
    readChannels();
    if(readingMessage) return;
    parseChannels(inputString);
}
void readChannels() {
  char inChar = (char)SerialBT.read();

  if (inChar == '<') {
    inputString = "";
    readingMessage = true;
  } else if (inChar == '>' && readingMessage) {
    readingMessage = false;
  } else if (readingMessage) {
    inputString += inChar;
  }
}

void parseChannels(String data) {
  int index = 0;
  char* token;
  char buf[128];
  data.toCharArray(buf, sizeof(buf));
  token = strtok(buf, " ");

  if (token == NULL) return;
  int numChannels = atoi(token);
  token = strtok(NULL, " ");

  while (token != NULL && index < numChannels) {
    channels[index] = atoi(token);
    // channels[index] = atoi(token);
    index++;
    token = strtok(NULL, " ");
  }

  // For debugging: print parsed values
  for (int i = 0; i < index; i++) {
    Serial.print(channels[i]);
    Serial.print(" ");
  }
  Serial.println();
}

`;

const arduinoCodeForBluetooth = `
// Arduino code to read Bluetooth messages and parse channel data
// This code assumes you have a Bluetooth module connected to your Arduino on TX and RX pins

#define BUFFER_SIZE 100
char inputString[BUFFER_SIZE];      // Buffer for incoming serial data
int channels[100];
bool messageComplete = false;

void setup() {
  Serial.begin(115200);
  Serial.println("✅ Serial Monitor started.");
}


void loop() {
  if (Serial.available()) {
    readChannels();
    if(readingMessage) return;
    parseChannels(inputString);
}
void readChannels() {
  char inChar = (char)Serial.read();

  if (inChar == '<') {
    inputString = "";
    readingMessage = true;
  } else if (inChar == '>' && readingMessage) {
    readingMessage = false;
  } else if (readingMessage) {
    inputString += inChar;
  }
}

void parseChannels(String data) {
  int index = 0;
  char* token;
  char buf[128];
  data.toCharArray(buf, sizeof(buf));
  token = strtok(buf, " ");

  if (token == NULL) return;
  int numChannels = atoi(token);
  token = strtok(NULL, " ");

  while (token != NULL && index < numChannels) {
    channels[index] = atoi(token);
    // channels[index] = atoi(token);
    index++;
    token = strtok(NULL, " ");
  }

  // For debugging: print parsed values
  for (int i = 0; i < index; i++) {
    Serial.print(channels[i]);
    Serial.print(" ");
  }
  Serial.println();
}
`

export {
    esp32CodeForBluetooth,
    arduinoCodeForBluetooth,
}