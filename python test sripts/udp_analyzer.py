#!/usr/bin/env python3
"""
Advanced UDP Gamepad Data Analyzer
==================================

This script provides advanced monitoring and analysis of UDP gamepad data
from the React Native app with logging, statistics, and real-time display.

Features:
- Real-time packet monitoring
- Data logging to file
- Statistics and performance metrics
- Multiple display modes
- Arduino code generation

Usage:
    python udp_analyzer.py [options]
    
Options:
    --port PORT     UDP port to listen on (default: 1234)
    --log FILE      Log packets to file
    --quiet         Minimal output mode
    --stats         Show statistics every 10 seconds
    --arduino       Generate Arduino parsing code
"""

import socket
import json
import sys
import time
import argparse
from datetime import datetime
from collections import defaultdict, deque
import threading

class GamepadAnalyzer:
    def __init__(self, port=1234, log_file=None, quiet=False, show_stats=False):
        self.port = port
        self.log_file = log_file
        self.quiet = quiet
        self.show_stats = show_stats
        
        # Statistics
        self.packet_count = 0
        self.start_time = time.time()
        self.last_stats_time = time.time()
        self.packet_sizes = deque(maxlen=100)  # Keep last 100 packet sizes
        self.packet_times = deque(maxlen=100)  # Keep last 100 packet timestamps
        self.control_stats = defaultdict(int)  # Count of each control usage
        
        # Data storage
        self.recent_packets = deque(maxlen=50)  # Keep last 50 packets
        
        # File handle for logging
        self.log_handle = None
        if log_file:
            self.log_handle = open(log_file, 'w')
            self.log_handle.write(f"# UDP Gamepad Data Log\n")
            self.log_handle.write(f"# Started: {datetime.now().isoformat()}\n")
            self.log_handle.write(f"# Port: {port}\n\n")
    
    def log_packet(self, data, addr, packet_type, parsed_data=None):
        """Log packet data to file if logging is enabled."""
        if self.log_handle:
            timestamp = datetime.now().isoformat()
            self.log_handle.write(f"{timestamp},{addr[0]},{addr[1]},{packet_type},{len(data)}")
            if parsed_data:
                self.log_handle.write(f",{json.dumps(parsed_data)}")
            self.log_handle.write(f",{data.decode('utf-8', errors='ignore')}\n")
            self.log_handle.flush()
    
    def update_stats(self, data, parsed_data=None):
        """Update statistics with new packet data."""
        self.packet_count += 1
        self.packet_sizes.append(len(data))
        self.packet_times.append(time.time())
        
        # Update control usage statistics
        if parsed_data:
            if isinstance(parsed_data, dict):
                for key, value in parsed_data.items():
                    if key not in ['timestamp', 'deviceInfo'] and value != 0:
                        self.control_stats[key] += 1
    
    def print_stats(self):
        """Print current statistics."""
        current_time = time.time()
        elapsed = current_time - self.start_time
        
        # Calculate packet rate
        recent_packets = [t for t in self.packet_times if current_time - t <= 10]
        packet_rate = len(recent_packets) / min(10, elapsed)
        
        # Calculate average packet size
        avg_size = sum(self.packet_sizes) / len(self.packet_sizes) if self.packet_sizes else 0
        
        print(f"\n📊 STATISTICS (after {elapsed:.1f}s)")
        print(f"📦 Total packets: {self.packet_count}")
        print(f"⚡ Packet rate: {packet_rate:.1f} packets/sec")
        print(f"📏 Avg packet size: {avg_size:.1f} bytes")
        
        if self.control_stats:
            print(f"🎮 Most used controls:")
            sorted_controls = sorted(self.control_stats.items(), key=lambda x: x[1], reverse=True)
            for control, count in sorted_controls[:5]:
                print(f"   {control}: {count} times")
        print("-" * 50)
    
    def process_packet(self, data, addr):
        """Process a received UDP packet."""
        try:
            message = data.decode('utf-8')
            parsed_data = None
            packet_type = "unknown"
            
            # Try to parse as JSON first
            if message.startswith('{') and message.endswith('}'):
                try:
                    parsed_data = json.loads(message)
                    packet_type = "json"
                    
                    if not self.quiet:
                        print(f"\n📦 Packet #{self.packet_count + 1} from {addr[0]}:{addr[1]}")
                        print(f"⏰ {datetime.now().strftime('%H:%M:%S.%f')[:-3]}")
                        print(f"📄 JSON: {json.dumps(parsed_data, indent=2)}")
                        
                        # Show active controls
                        active_controls = {}
                        for section in ['buttons', 'axes']:
                            if section in parsed_data:
                                for k, v in parsed_data[section].items():
                                    if v != 0:
                                        active_controls[k] = v
                        
                        if active_controls:
                            print(f"🎯 Active: {active_controls}")
                        else:
                            print(f"🎯 No active controls")
                
                except json.JSONDecodeError:
                    packet_type = "simple"
                    # Parse as simple key=value format
                    parsed_data = {}
                    for pair in message.split(','):
                        if '=' in pair:
                            key, value = pair.split('=', 1)
                            try:
                                parsed_data[key] = float(value)
                            except ValueError:
                                parsed_data[key] = value
                    
                    if not self.quiet:
                        print(f"\n📦 Packet #{self.packet_count + 1} from {addr[0]}:{addr[1]}")
                        print(f"⏰ {datetime.now().strftime('%H:%M:%S.%f')[:-3]}")
                        print(f"📄 Simple: {message}")
                        if parsed_data:
                            print(f"🎯 Controls: {parsed_data}")
            
            else:
                # Simple format
                packet_type = "simple"
                parsed_data = {}
                if message:
                    for pair in message.split(','):
                        if '=' in pair:
                            key, value = pair.split('=', 1)
                            try:
                                parsed_data[key] = float(value)
                            except ValueError:
                                parsed_data[key] = value
                
                if not self.quiet:
                    print(f"\n📦 Packet #{self.packet_count + 1} from {addr[0]}:{addr[1]}")
                    print(f"⏰ {datetime.now().strftime('%H:%M:%S.%f')[:-3]}")
                    print(f"📄 Simple: {message}")
                    if parsed_data:
                        print(f"🎯 Controls: {parsed_data}")
            
            # Update statistics
            self.update_stats(data, parsed_data)
            
            # Log packet
            self.log_packet(data, addr, packet_type, parsed_data)
            
            # Store recent packet
            self.recent_packets.append({
                'timestamp': time.time(),
                'addr': addr,
                'type': packet_type,
                'data': parsed_data,
                'raw': message
            })
            
        except UnicodeDecodeError:
            if not self.quiet:
                print(f"\n📦 Binary packet #{self.packet_count + 1} from {addr[0]}:{addr[1]}")
                print(f"📄 Hex: {data.hex()}")
            
            self.update_stats(data)
            self.log_packet(data, addr, "binary")
    
    def generate_arduino_code(self):
        """Generate Arduino code based on received data patterns."""
        if not self.recent_packets:
            print("❌ No packets received yet. Cannot generate Arduino code.")
            return
        
        # Analyze recent packets to determine format and controls
        has_json = any(p['type'] == 'json' for p in self.recent_packets)
        has_simple = any(p['type'] == 'simple' for p in self.recent_packets)
        
        # Get all unique controls seen
        all_controls = set()
        for packet in self.recent_packets:
            if packet['data']:
                if packet['type'] == 'json':
                    for section in ['buttons', 'axes']:
                        if section in packet['data']:
                            all_controls.update(packet['data'][section].keys())
                else:
                    all_controls.update(packet['data'].keys())
        
        print(f"\n🤖 ARDUINO CODE GENERATOR")
        print(f"📊 Analyzed {len(self.recent_packets)} recent packets")
        print(f"🎮 Found {len(all_controls)} unique controls: {sorted(all_controls)}")
        print(f"📡 Formats detected: {'JSON' if has_json else ''} {'Simple' if has_simple else ''}")
        
        arduino_code = f'''
/*
 * Auto-generated Arduino UDP Gamepad Receiver
 * Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 * Based on {len(self.recent_packets)} analyzed packets
 * Port: {self.port}
 */

#include <WiFi.h>
#include <WiFiUdp.h>

WiFiUDP udp;
const int UDP_PORT = {self.port};
char packetBuffer[255];

// Gamepad state variables
'''
        
        # Generate variables for each control
        for control in sorted(all_controls):
            if control not in ['timestamp', 'deviceInfo']:
                arduino_code += f"float {control.replace(' ', '_')} = 0.0;\n"
        
        arduino_code += '''
void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin("your_wifi_ssid", "your_wifi_password");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  udp.begin(UDP_PORT);
  Serial.printf("UDP listening on port %d\\n", UDP_PORT);
}

void loop() {
  int packetSize = udp.parsePacket();
  if (packetSize) {
    int len = udp.read(packetBuffer, 255);
    if (len > 0) {
      packetBuffer[len] = 0;
      
      // Parse the received data
      parseGamepadData(String(packetBuffer));
      
      // Use the data for your robot control here
      controlRobot();
    }
  }
  delay(10);
}

void parseGamepadData(String data) {
'''
        
        if has_simple:
            arduino_code += '''
  // Parse simple key=value format
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
    
    int equalIndex = pair.indexOf('=');
    if (equalIndex != -1) {
      String key = pair.substring(0, equalIndex);
      float value = pair.substring(equalIndex + 1).toFloat();
      
      // Update gamepad state
'''
            
            for control in sorted(all_controls):
                if control not in ['timestamp', 'deviceInfo']:
                    var_name = control.replace(' ', '_')
                    arduino_code += f'      if (key == "{control}") {var_name} = value;\n'
            
            arduino_code += '''
      Serial.printf("%s = %.3f\\n", key.c_str(), value);
    }
  }
'''
        
        arduino_code += '''
}

void controlRobot() {
  // Example robot control code
  // Replace this with your actual robot control logic
  
'''
        
        # Generate example usage for common controls
        if 'leftX' in all_controls and 'leftY' in all_controls:
            arduino_code += '''
  // Tank drive example using left stick
  float leftMotor = leftY + leftX;
  float rightMotor = leftY - leftX;
  
  // Constrain values
  leftMotor = constrain(leftMotor, -1.0, 1.0);
  rightMotor = constrain(rightMotor, -1.0, 1.0);
  
  // Convert to PWM (0-255)
  // analogWrite(LEFT_MOTOR_PIN, abs(leftMotor) * 255);
  // analogWrite(RIGHT_MOTOR_PIN, abs(rightMotor) * 255);
'''
        
        if 'A' in all_controls:
            arduino_code += '''
  // Button example
  if (A > 0) {
    // Button A pressed
    // digitalWrite(LED_PIN, HIGH);
  }
'''
        
        arduino_code += '''
}
'''
        
        print(arduino_code)
        
        # Save to file
        with open('gamepad_receiver.ino', 'w') as f:
            f.write(arduino_code)
        print(f"💾 Arduino code saved to 'gamepad_receiver.ino'")
    
    def listen(self):
        """Main listening loop."""
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
        try:
            sock.bind(('0.0.0.0', self.port))
            print(f"🎮 Advanced UDP Gamepad Analyzer")
            print(f"📡 Listening on port {self.port}")
            if self.log_file:
                print(f"📝 Logging to {self.log_file}")
            print(f"💡 Press Ctrl+C to stop")
            print("-" * 60)
            
            # Start stats thread if enabled
            if self.show_stats:
                def stats_thread():
                    while True:
                        time.sleep(10)
                        self.print_stats()
                
                stats_t = threading.Thread(target=stats_thread, daemon=True)
                stats_t.start()
            
            while True:
                try:
                    data, addr = sock.recvfrom(1024)
                    self.process_packet(data, addr)
                    
                except KeyboardInterrupt:
                    print(f"\n🛑 Stopping analyzer...")
                    break
        
        except socket.error as e:
            print(f"❌ Socket error: {e}")
            return False
        
        finally:
            sock.close()
            if self.log_handle:
                self.log_handle.close()
            
            # Final stats
            print(f"\n📊 FINAL STATISTICS")
            self.print_stats()
            
            # Offer to generate Arduino code
            if self.recent_packets:
                response = input("\n🤖 Generate Arduino code? (y/n): ")
                if response.lower() == 'y':
                    self.generate_arduino_code()
        
        return True

def main():
    parser = argparse.ArgumentParser(description='Advanced UDP Gamepad Data Analyzer')
    parser.add_argument('--port', type=int, default=1234, help='UDP port to listen on')
    parser.add_argument('--log', type=str, help='Log packets to file')
    parser.add_argument('--quiet', action='store_true', help='Minimal output mode')
    parser.add_argument('--stats', action='store_true', help='Show statistics every 10 seconds')
    parser.add_argument('--arduino', action='store_true', help='Generate Arduino code at startup')
    
    args = parser.parse_args()
    
    analyzer = GamepadAnalyzer(
        port=args.port,
        log_file=args.log,
        quiet=args.quiet,
        show_stats=args.stats
    )
    
    success = analyzer.listen()
    
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()
