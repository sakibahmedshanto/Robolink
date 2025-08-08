#!/usr/bin/env python3
"""
ESP32 Camera Stream Tester
Tests both MJPEG stream and single JPEG endpoints
Useful for verifying camera functionality before integrating with React Native
"""

import requests
import cv2
import numpy as np
import time
import argparse
from io import BytesIO
import threading
import sys

class ESP32CameraTester:
    def __init__(self, ip_address):
        self.ip_address = ip_address
        self.web_server_url = f"http://{ip_address}"
        self.stream_server_url = f"http://{ip_address}:81"
        self.single_jpeg_url = f"{self.web_server_url}/jpg"
        self.mjpeg_stream_url = f"{self.stream_server_url}/stream"
        self.capture_url = f"{self.web_server_url}/capture"
        self.status_url = f"{self.web_server_url}/status"
        
    def test_connection(self):
        """Test basic connectivity to the ESP32"""
        print(f"Testing connection to ESP32 at {self.ip_address}...")
        try:
            response = requests.get(self.web_server_url, timeout=5)
            if response.status_code == 200:
                print("✓ Successfully connected to ESP32 web server")
                return True
            else:
                print(f"✗ Web server responded with status code: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"✗ Failed to connect to web server: {e}")
            return False
    
    def test_single_jpeg(self):
        """Test single JPEG capture endpoint"""
        print("\nTesting single JPEG capture...")
        try:
            response = requests.get(self.single_jpeg_url, timeout=10)
            if response.status_code == 200:
                # Check if it's actually a JPEG
                if response.headers.get('content-type') == 'image/jpeg':
                    print(f"✓ Single JPEG capture successful ({len(response.content)} bytes)")
                    
                    # Try to decode the image
                    img_array = np.frombuffer(response.content, np.uint8)
                    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
                    if img is not None:
                        print(f"✓ JPEG image decoded successfully ({img.shape[1]}x{img.shape[0]})")
                        return True, response.content
                    else:
                        print("✗ Failed to decode JPEG image")
                        return False, None
                else:
                    print(f"✗ Unexpected content type: {response.headers.get('content-type')}")
                    return False, None
            else:
                print(f"✗ Single JPEG capture failed with status: {response.status_code}")
                return False, None
        except requests.exceptions.RequestException as e:
            print(f"✗ Single JPEG request failed: {e}")
            return False, None
    
    def test_mjpeg_stream(self, duration=10):
        """Test MJPEG stream for specified duration"""
        print(f"\nTesting MJPEG stream for {duration} seconds...")
        try:
            response = requests.get(self.mjpeg_stream_url, stream=True, timeout=10)
            if response.status_code == 200:
                print("✓ Connected to MJPEG stream")
                
                # Check content type
                content_type = response.headers.get('content-type', '')
                if 'multipart/x-mixed-replace' in content_type:
                    print("✓ Correct MJPEG content type detected")
                else:
                    print(f"⚠ Unexpected content type: {content_type}")
                
                # Parse the stream
                boundary = None
                if 'boundary=' in content_type:
                    boundary = content_type.split('boundary=')[1]
                    print(f"✓ Stream boundary: {boundary}")
                
                frame_count = 0
                start_time = time.time()
                buffer = b""
                
                for chunk in response.iter_content(chunk_size=1024):
                    if time.time() - start_time > duration:
                        break
                    
                    buffer += chunk
                    
                    # Look for JPEG markers
                    while True:
                        # Find JPEG start marker
                        start_marker = buffer.find(b'\xff\xd8')
                        if start_marker == -1:
                            break
                        
                        # Find JPEG end marker
                        end_marker = buffer.find(b'\xff\xd9', start_marker)
                        if end_marker == -1:
                            break
                        
                        # Extract JPEG frame
                        jpeg_data = buffer[start_marker:end_marker + 2]
                        buffer = buffer[end_marker + 2:]
                        
                        # Try to decode the frame
                        img_array = np.frombuffer(jpeg_data, np.uint8)
                        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
                        if img is not None:
                            frame_count += 1
                            if frame_count == 1:
                                print(f"✓ First frame decoded ({img.shape[1]}x{img.shape[0]})")
                        
                        if frame_count % 30 == 0:  # Print every 30 frames
                            elapsed = time.time() - start_time
                            fps = frame_count / elapsed if elapsed > 0 else 0
                            print(f"  Frames received: {frame_count}, FPS: {fps:.1f}")
                
                elapsed = time.time() - start_time
                avg_fps = frame_count / elapsed if elapsed > 0 else 0
                print(f"✓ Stream test completed: {frame_count} frames in {elapsed:.1f}s (avg {avg_fps:.1f} FPS)")
                return True, frame_count, avg_fps
            else:
                print(f"✗ MJPEG stream failed with status: {response.status_code}")
                return False, 0, 0
        except requests.exceptions.RequestException as e:
            print(f"✗ MJPEG stream request failed: {e}")
            return False, 0, 0
    
    def test_camera_status(self):
        """Test camera status endpoint"""
        print("\nTesting camera status...")
        try:
            response = requests.get(self.status_url, timeout=5)
            if response.status_code == 200:
                print("✓ Camera status endpoint accessible")
                # The status might be in JSON format
                try:
                    status_data = response.json()
                    print(f"✓ Status data: {len(status_data)} parameters")
                    return True, status_data
                except:
                    print(f"✓ Status response ({len(response.text)} chars)")
                    return True, response.text
            else:
                print(f"✗ Status endpoint failed with status: {response.status_code}")
                return False, None
        except requests.exceptions.RequestException as e:
            print(f"✗ Status request failed: {e}")
            return False, None
    
    def save_test_image(self, jpeg_data, filename="test_capture.jpg"):
        """Save a test image to verify quality"""
        if jpeg_data:
            try:
                with open(filename, 'wb') as f:
                    f.write(jpeg_data)
                print(f"✓ Test image saved as {filename}")
                return True
            except Exception as e:
                print(f"✗ Failed to save test image: {e}")
                return False
        return False
    
    def run_comprehensive_test(self):
        """Run all tests"""
        print("=" * 60)
        print("ESP32 Camera Stream Comprehensive Test")
        print("=" * 60)
        
        # Test 1: Basic connectivity
        if not self.test_connection():
            print("\n❌ Basic connectivity failed. Please check:")
            print("   - ESP32 is powered on and connected to WiFi")
            print("   - IP address is correct")
            print("   - Network connectivity")
            return False
        
        # Test 2: Camera status
        status_ok, status_data = self.test_camera_status()
        
        # Test 3: Single JPEG capture
        jpeg_ok, jpeg_data = self.test_single_jpeg()
        if jpeg_ok and jpeg_data:
            self.save_test_image(jpeg_data)
        
        # Test 4: MJPEG stream
        stream_ok, frame_count, fps = self.test_mjpeg_stream(duration=10)
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"Basic connectivity: {'✓ PASS' if True else '✗ FAIL'}")
        print(f"Camera status:      {'✓ PASS' if status_ok else '✗ FAIL'}")
        print(f"Single JPEG:        {'✓ PASS' if jpeg_ok else '✗ FAIL'}")
        print(f"MJPEG stream:       {'✓ PASS' if stream_ok else '✗ FAIL'}")
        
        if stream_ok:
            print(f"Stream performance: {frame_count} frames, {fps:.1f} FPS")
        
        print("\nFor React Native integration:")
        print(f"- MJPEG Stream URL: {self.mjpeg_stream_url}")
        print(f"- Single JPEG URL:  {self.single_jpeg_url}")
        print(f"- Status URL:       {self.status_url}")
        
        return jpeg_ok and stream_ok

def main():
    parser = argparse.ArgumentParser(description='Test ESP32 camera streaming functionality')
    parser.add_argument('ip_address', help='IP address of the ESP32 camera')
    parser.add_argument('--duration', type=int, default=10, help='Stream test duration in seconds (default: 10)')
    parser.add_argument('--save-image', action='store_true', help='Save a test image')
    
    args = parser.parse_args()
    
    tester = ESP32CameraTester(args.ip_address)
    
    if args.save_image:
        # Just capture and save an image
        jpeg_ok, jpeg_data = tester.test_single_jpeg()
        if jpeg_ok:
            tester.save_test_image(jpeg_data)
    else:
        # Run comprehensive test
        success = tester.run_comprehensive_test()
        sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
