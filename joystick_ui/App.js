// App.js - Fixed Landscape Optimized RoboWheel Controller for Expo Snack
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Constants optimized for landscape - reduced sizes for better fit
const STICK_MAX_DISTANCE = 40;
const STICK_SIZE = 30;
const STICK_BACKGROUND_SIZE = 85;
const BUTTON_SIZE = 38;
const DPAD_SIZE = 30;

// Colors
const colors = {
  primary: '#2a2a2a',
  secondary: '#1f1f1f',
  accent: '#ff4444',
  accentActive: '#ff6666',
  background: '#2a2a2a',
  surface: '#444',
  surfaceLight: '#555',
  surfacePressed: '#666',
  text: '#ffffff',
  textSecondary: '#cccccc',
  textMuted: '#999',
  border: '#555',
  borderLight: '#666',
  success: '#4CAF50',
  warning: '#FF9800',
};

// Analog Stick Component
const AnalogStick = ({ onPositionChange, label, style }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: (event, gestureState) => {
        const { dx, dy } = gestureState;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let finalX = dx;
        let finalY = dy;
        
        if (distance > STICK_MAX_DISTANCE) {
          const angle = Math.atan2(dy, dx);
          finalX = Math.cos(angle) * STICK_MAX_DISTANCE;
          finalY = Math.sin(angle) * STICK_MAX_DISTANCE;
        }
        
        pan.setValue({ x: finalX, y: finalY });
        
        const normalized = {
          x: Number((finalX / STICK_MAX_DISTANCE).toFixed(2)),
          y: Number((finalY / STICK_MAX_DISTANCE).toFixed(2)),
          magnitude: Math.min(distance / STICK_MAX_DISTANCE, 1)
        };
        
        setPosition(normalized);
        onPositionChange(normalized);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          tension: 150,
          friction: 8,
        }).start();
        
        setPosition({ x: 0, y: 0, magnitude: 0 });
        onPositionChange({ x: 0, y: 0, magnitude: 0 });
      },
    })
  ).current;

  return (
    <View style={[styles.stickContainer, style]}>
      <View style={styles.stickBackground}>
        <Animated.View
          style={[
            styles.stick,
            {
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            },
          ]}
          {...panResponder.panHandlers}
        />
      </View>
      <Text style={styles.stickLabel}>{label}</Text>
      <View style={styles.stickValues}>
        <Text style={styles.stickValue}>X: {position.x}</Text>
        <Text style={styles.stickValue}>Y: {position.y}</Text>
      </View>
    </View>
  );
};

// Action Button Component
const ActionButton = ({ label, onPress, isPressed, style, color = colors.surface }) => (
  <TouchableOpacity
    style={[
      styles.actionButton,
      { backgroundColor: isPressed ? colors.accentActive : color },
      { borderColor: isPressed ? colors.accentActive : colors.border },
      style,
    ]}
    onPressIn={() => onPress(label, true)}
    onPressOut={() => onPress(label, false)}
    activeOpacity={0.8}
  >
    <Text style={[styles.buttonText, isPressed && styles.buttonTextPressed]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// DPad Component
const DPad = ({ onPress }) => (
  <View style={styles.dpadContainer}>
    {/* Up */}
    <TouchableOpacity
      style={[styles.dpadButton, styles.dpadUp]}
      onPress={() => onPress('up')}
      activeOpacity={0.7}
    >
      <Ionicons name="chevron-up" size={16} color={colors.text} />
    </TouchableOpacity>
    
    {/* Middle Row */}
    <View style={styles.dpadMiddleRow}>
      <TouchableOpacity
        style={[styles.dpadButton, styles.dpadLeft]}
        onPress={() => onPress('left')}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={16} color={colors.text} />
      </TouchableOpacity>
      
      <View style={styles.dpadCenter} />
      
      <TouchableOpacity
        style={[styles.dpadButton, styles.dpadRight]}
        onPress={() => onPress('right')}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-forward" size={16} color={colors.text} />
      </TouchableOpacity>
    </View>
    
    {/* Down */}
    <TouchableOpacity
      style={[styles.dpadButton, styles.dpadDown]}
      onPress={() => onPress('down')}
      activeOpacity={0.7}
    >
      <Ionicons name="chevron-down" size={16} color={colors.text} />
    </TouchableOpacity>
  </View>
);

// Main App Component
export default function App() {
  const [leftStick, setLeftStick] = useState({ x: 0, y: 0, magnitude: 0 });
  const [rightStick, setRightStick] = useState({ x: 0, y: 0, magnitude: 0 });
  const [pressedButtons, setPressedButtons] = useState(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Handle stick movements
  const handleLeftStick = (position) => {
    setLeftStick(position);
    if (position.magnitude > 0.1) {
      console.log('Movement:', `X:${position.x} Y:${position.y} Power:${(position.magnitude * 100).toFixed(0)}%`);
    }
  };

  const handleRightStick = (position) => {
    setRightStick(position);
    if (position.magnitude > 0.1) {
      console.log('Rotation:', `X:${position.x} Y:${position.y} Power:${(position.magnitude * 100).toFixed(0)}%`);
    }
  };

  // Handle button presses
  const handleButtonPress = (button, isPressed) => {
    setPressedButtons(prev => {
      const newSet = new Set(prev);
      if (isPressed) {
        newSet.add(button);
        console.log(`🔴 Button ${button} PRESSED`);
      } else {
        newSet.delete(button);
        console.log(`⚪ Button ${button} RELEASED`);
      }
      return newSet;
    });
  };

  // Handle D-Pad
  const handleDPad = (direction) => {
    console.log(`🎯 D-Pad: ${direction.toUpperCase()}`);
  };

  // Toggle pause
  const togglePause = () => {
    const newState = !isPaused;
    setIsPaused(newState);
    console.log(`⏯️ ${newState ? 'PAUSED' : 'RESUMED'}`);
  };

  // Toggle connection
  const toggleConnection = () => {
    const newState = !isConnected;
    setIsConnected(newState);
    console.log(`📶 ${newState ? 'CONNECTED' : 'DISCONNECTED'}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Top Header */}
      <View style={styles.topHeader}>
        {/* Left Section */}
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="arrow-back" size={18} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerText}>BACK</Text>
        </View>

        {/* Center Section */}
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Robolink Controller</Text>
          <TouchableOpacity 
            style={[styles.pauseButton, isPaused && styles.pauseButtonActive]}
            onPress={togglePause}
          >
            <Ionicons 
              name={isPaused ? "play" : "pause"} 
              size={12} 
              color={colors.text} 
            />
            <Text style={styles.pauseText}>
              {isPaused ? 'RESUME' : 'PAUSE'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Right Section */}
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleConnection}>
            <Ionicons 
              name="bluetooth" 
              size={18} 
              color={isConnected ? colors.success : colors.accent} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: isConnected ? colors.success : colors.accent }]}>
            {isConnected ? 'CONNECTED' : 'OFFLINE'}
          </Text>
        </View>
      </View>

      {/* Main Controller Area */}
      <View style={styles.mainController}>
        
        {/* Left Control Panel */}
        <View style={styles.leftPanel}>
          <AnalogStick 
            onPositionChange={handleLeftStick} 
            label="MOVEMENT"
            style={styles.leftStick}
          />
          
          <View style={styles.dpadSection}>
            <Text style={styles.sectionLabel}>D-PAD</Text>
            <DPad onPress={handleDPad} />
          </View>
        </View>

        {/* Center Status Panel */}
        <View style={styles.centerPanel}>
          <View style={styles.statusPanel}>
            <Text style={styles.statusTitle}>ROBOT STATUS</Text>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Connection:</Text>
              <Text style={[styles.statusValue, { color: isConnected ? colors.success : colors.accent }]}>
                {isConnected ? 'ACTIVE' : 'OFFLINE'}
              </Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>State:</Text>
              <Text style={[styles.statusValue, { color: isPaused ? colors.warning : colors.success }]}>
                {isPaused ? 'PAUSED' : 'READY'}
              </Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Movement:</Text>
              <Text style={styles.statusValue}>
                {leftStick.magnitude > 0.1 ? `${(leftStick.magnitude * 100).toFixed(0)}%` : '0%'}
              </Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Rotation:</Text>
              <Text style={styles.statusValue}>
                {rightStick.magnitude > 0.1 ? `${(rightStick.magnitude * 100).toFixed(0)}%` : '0%'}
              </Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Active:</Text>
              <Text style={styles.statusValue}>
                {pressedButtons.size > 0 ? Array.from(pressedButtons).join(', ') : 'None'}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Control Panel */}
        <View style={styles.rightPanel}>
          <AnalogStick 
            onPositionChange={handleRightStick} 
            label="ROTATION"
            style={styles.rightStick}
          />
          
          <View style={styles.actionSection}>
            <Text style={styles.sectionLabel}>ACTIONS</Text>
            <View style={styles.actionButtonsGrid}>
              {/* Top Button */}
              <ActionButton
                label="Y"
                onPress={handleButtonPress}
                isPressed={pressedButtons.has('Y')}
                style={styles.buttonTop}
                color="#FFD700"
              />
              
              {/* Middle Row */}
              <View style={styles.actionMiddleRow}>
                <ActionButton
                  label="X"
                  onPress={handleButtonPress}
                  isPressed={pressedButtons.has('X')}
                  color="#87CEEB"
                />
                <ActionButton
                  label="B"
                  onPress={handleButtonPress}
                  isPressed={pressedButtons.has('B')}
                  color="#FF6B6B"
                />
              </View>
              
              {/* Bottom Button */}
              <ActionButton
                label="A"
                onPress={handleButtonPress}
                isPressed={pressedButtons.has('A')}
                style={styles.buttonBottom}
                color="#90EE90"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Info Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.infoText}>
          Open Console to see real-time input data • Both analog sticks can be controlled simultaneously
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header Styles - Made more compact
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  iconButton: {
    marginRight: 6,
  },
  headerText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pauseButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pauseText: {
    color: colors.text,
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 3,
  },
  
  // Main Controller Styles - Optimized spacing
  mainController: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  
  // Panel Styles
  leftPanel: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  centerPanel: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  rightPanel: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
  },
  
  // Analog Stick Styles - Reduced sizes
  stickContainer: {
    alignItems: 'center',
  },
  stickBackground: {
    width: STICK_BACKGROUND_SIZE,
    height: STICK_BACKGROUND_SIZE,
    borderRadius: STICK_BACKGROUND_SIZE / 2,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  stick: {
    width: STICK_SIZE,
    height: STICK_SIZE,
    borderRadius: STICK_SIZE / 2,
    backgroundColor: colors.surfaceLight,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  stickLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  stickValues: {
    flexDirection: 'row',
    marginTop: 3,
    gap: 6,
  },
  stickValue: {
    color: colors.textMuted,
    fontSize: 8,
    fontFamily: 'monospace',
  },
  
  // D-Pad Styles - Reduced sizes
  dpadSection: {
    alignItems: 'center',
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  dpadContainer: {
    alignItems: 'center',
  },
  dpadButton: {
    width: DPAD_SIZE,
    height: DPAD_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 3,
  },
  dpadUp: {
    marginBottom: 2,
  },
  dpadDown: {
    marginTop: 2,
  },
  dpadMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dpadLeft: {
    marginRight: 2,
  },
  dpadRight: {
    marginLeft: 2,
  },
  dpadCenter: {
    width: 16,
    height: 16,
  },
  
  // Action Button Styles - Reduced sizes and spacing
  actionSection: {
    alignItems: 'center',
  },
  actionButtonsGrid: {
    alignItems: 'center',
  },
  actionButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  actionMiddleRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 5,
  },
  buttonTop: {
    marginBottom: 2,
  },
  buttonBottom: {
    marginTop: 2,
  },
  buttonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonTextPressed: {
    color: colors.text,
  },
  
  // Status Panel Styles - More compact
  statusPanel: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusTitle: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '500',
  },
  statusValue: {
    color: colors.text,
    fontSize: 9,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  
  // Bottom Bar Styles
  bottomBar: {
    backgroundColor: colors.secondary,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoText: {
    color: colors.textMuted,
    fontSize: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});