#!/usr/bin/env python3
"""
UDP Listener for React Native Gamepad Data
==========================================

This script listens for UDP packets from the React Native gamepad app
and displays the received data in a readable format.

Usage:
    python udp_listener.py [port]

Default port: 1234 (same as React Native app)
"""

import socket
import json
import sys
import time
from datetime import datetime

def listen_udp(port=1234):
    """
    Listen for UDP packets on the specified port and display gamepad data.
    
    Args:
        port (int): UDP port to listen on (default: 1234)
    """
    
    # Create UDP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    try:
        # Bind to all interfaces on the specified port
        sock.bind(('0.0.0.0', port))
        print(f"🎮 UDP Gamepad Listener started on port {port}")
        print(f"📡 Listening for packets from React Native app...")
        print(f"⏰ Started at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("-" * 60)
        
        packet_count = 0
        last_data = None
        
        while True:
            try:
                # Receive data (buffer size 1024 bytes should be enough)
                data, addr = sock.recvfrom(1024)
                packet_count += 1
                
                # Decode the received data
                try:
                    # First try to decode as UTF-8 string
                    message = data.decode('utf-8')
                    
                    # Check if it's JSON format (from sendGamepadData function)
                    if message.startswith('{') and message.endswith('}'):
                        try:
                            json_data = json.loads(message)
                            print(f"\n📦 Packet #{packet_count} from {addr[0]}:{addr[1]}")
                            print(f"⏰ Time: {datetime.now().strftime('%H:%M:%S.%f')[:-3]}")
                            print(f"📄 JSON Format:")
                            print(json.dumps(json_data, indent=2))
                            
                            # Extract and display key information
                            if 'buttons' in json_data and 'axes' in json_data:
                                active_buttons = {k: v for k, v in json_data['buttons'].items() if v != 0}
                                active_axes = {k: v for k, v in json_data['axes'].items() if v != 0}
                                
                                if active_buttons or active_axes:
                                    print(f"🎯 Active Controls:")
                                    if active_buttons:
                                        print(f"   Buttons: {active_buttons}")
                                    if active_axes:
                                        print(f"   Axes: {active_axes}")
                                else:
                                    print(f"🎯 No active controls")
                        
                        except json.JSONDecodeError:
                            # Not valid JSON, treat as simple format
                            print(f"\n📦 Packet #{packet_count} from {addr[0]}:{addr[1]}")
                            print(f"⏰ Time: {datetime.now().strftime('%H:%M:%S.%f')[:-3]}")
                            print(f"📄 Simple Format: {message}")
                            
                            # Parse simple key=value format
                            if message:
                                controls = {}
                                for pair in message.split(','):
                                    if '=' in pair:
                                        key, value = pair.split('=', 1)
                                        try:
                                            controls[key] = float(value)
                                        except ValueError:
                                            controls[key] = value
                                
                                if controls:
                                    print(f"🎯 Parsed Controls: {controls}")
                            else:
                                print(f"🎯 Empty message (all controls at zero)")
                    
                    else:
                        # Simple key=value format
                        print(f"\n📦 Packet #{packet_count} from {addr[0]}:{addr[1]}")
                        print(f"⏰ Time: {datetime.now().strftime('%H:%M:%S.%f')[:-3]}")
                        print(f"📄 Simple Format: {message}")
                        
                        # Parse simple key=value format
                        if message:
                            controls = {}
                            for pair in message.split(','):
                                if '=' in pair:
                                    key, value = pair.split('=', 1)
                                    try:
                                        controls[key] = float(value)
                                    except ValueError:
                                        controls[key] = value
                            
                            if controls:
                                print(f"🎯 Parsed Controls: {controls}")
                        else:
                            print(f"🎯 Empty message (all controls at zero)")
                
                except UnicodeDecodeError:
                    # Binary data - display as hex
                    print(f"\n📦 Packet #{packet_count} from {addr[0]}:{addr[1]}")
                    print(f"⏰ Time: {datetime.now().strftime('%H:%M:%S.%f')[:-3]}")
                    print(f"📄 Binary Data ({len(data)} bytes): {data.hex()}")
                    print(f"📄 Raw Data: {data}")
                
                # Show separator for readability
                print("-" * 40)
                
                # Store last data for comparison
                last_data = data
                
            except socket.timeout:
                # Timeout is not set, so this shouldn't happen
                continue
                
            except KeyboardInterrupt:
                print(f"\n🛑 Stopping UDP listener...")
                break
                
    except socket.error as e:
        print(f"❌ Socket error: {e}")
        print(f"💡 Try running as administrator or check if port {port} is already in use")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False
        
    finally:
        sock.close()
        print(f"✅ UDP socket closed")
        if 'packet_count' in locals():
            print(f"📊 Total packets received: {packet_count}")
        return True

def main():
    """Main function to parse arguments and start the UDP listener."""
    
    # Default port (same as React Native app)
    port = 1234
    
    # Parse command line arguments
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
            if port < 1 or port > 65535:
                raise ValueError("Port must be between 1 and 65535")
        except ValueError as e:
            print(f"❌ Invalid port: {e}")
            print(f"Usage: python {sys.argv[0]} [port]")
            sys.exit(1)
    
    print("🎮 React Native Gamepad UDP Listener")
    print("=" * 50)
    print(f"📡 Port: {port}")
    print(f"💡 Make sure your React Native app is configured to send to this port")
    print(f"💡 Press Ctrl+C to stop")
    print()
    
    # Start listening
    success = listen_udp(port)
    
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()
