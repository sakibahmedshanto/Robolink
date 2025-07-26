/**
 * Custom Joystick Screen
 * Main screen component for creating and managing custom joystick layouts
 * Allows users to add, edit, position, and save custom button layouts
 * Fixed to horizontal orientation with gamepad-style layout
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, StatusBar, Platform, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// Component imports
import Header from '../components/CustomJoystickScreen/Header';
import Canvas from '../components/CustomJoystickScreen/Canvas';
import ButtonConfigModal from '../components/CustomJoystickScreen/ButtonConfigModal';
import SaveLayoutModal from '../components/CustomJoystickScreen/SaveLayoutModal';

// Add GlobalKeyEvent import for physical gamepad input handling
import { GlobalKeyEvent } from '../specs';

// Type and utility imports
import { JoystickButton, SavedLayout, ButtonConfig } from '../components/CustomJoystickScreen/types';
import { DEFAULT_BUTTON_CONFIG } from '../components/CustomJoystickScreen/constants';
import {
  loadSavedLayouts,
  saveSavedLayouts,
  loadCurrentLayout,
  saveCurrentLayout,
  createSavedLayout,
} from '../components/CustomJoystickScreen/storage';
import {
  createDefaultLayout,
  createNewButton,
  updateButtonPosition,
  updateButtonConfig,
  updateSliderValue,
  removeButton,
  getButtonConfig,
} from '../components/CustomJoystickScreen/utils';
import { createGamepadLayout } from '../components/CustomJoystickScreen/gamepadLayout';
import { hideNavigationBar, showNavigationBar } from '../utils/navigationBar';
import { constrainToScreenBounds } from '../components/CustomJoystickScreen/screenBounds';
import { useCustomJoystickData } from '../components/CustomJoystickScreen/dataTransmission';

const CustomJoystickScreen: React.FC = () => {
  // Data transmission hook for Bluetooth/UDP
  const {
    buttonStates,
    joystickData,
    handleButtonPress,
    handleJoystickMove,
    handleSliderChange,
    formatMessage,
  } = useCustomJoystickData();

  // State management
  const [layout, setLayout] = useState<JoystickButton[]>([]);
  const [newType, setNewType] = useState<string>('direction');
  const [newLabel, setNewLabel] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [currentLayoutName, setCurrentLayoutName] = useState<string>('Gamepad');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [saveLayoutName, setSaveLayoutName] = useState<string>('');

  // Button configuration state
  const [buttonConfig, setButtonConfig] = useState<ButtonConfig>(DEFAULT_BUTTON_CONFIG);

  // Physical gamepad input state - same as GamepadViewer component
  const [gamepadInputs, setGamepadInputs] = useState<{ [key: string]: any }>({});

  // State to show when physical input is detected
  const [lastPhysicalInput, setLastPhysicalInput] = useState<string>('');

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Physical gamepad input listeners - same as in GamepadViewer
  useEffect(() => {
    const subs = [
      GlobalKeyEvent.addKeyUpListener(updateInputs),
      GlobalKeyEvent.addKeyDownListener(updateInputs),
      GlobalKeyEvent.onJoystickMoveListener(updateInputs),
    ];

    return () => subs.forEach(sub => sub.remove());
  }, []);

  /**
   * Loads initial data from storage
   */
  const loadInitialData = async () => {
    try {
      const layouts = await loadSavedLayouts();
      setSavedLayouts(layouts);

      const currentLayout = await loadCurrentLayout();
      if (currentLayout) {
        // Constrain existing buttons to screen bounds
        const constrainedLayout = currentLayout.map(button => {
          const constrainedPos = constrainToScreenBounds(button.x, button.y, button.size);
          return {
            ...button,
            x: constrainedPos.x,
            y: constrainedPos.y,
          };
        });
        setLayout(constrainedLayout);
      } else {
        // Use gamepad layout as default instead of simple layout
        setLayout(createGamepadLayout());
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setLayout(createGamepadLayout());
    }
  };

  /**
   * Saves current layout to storage
   */
  const handleSaveCurrentLayout = async () => {
    try {
      await saveCurrentLayout(layout);
    } catch (error) {
      console.error('Error saving current layout:', error);
    }
  };

  /**
   * Saves layout with a custom name
   */
  const handleSaveLayoutWithName = async (name: string) => {
    try {
      const newLayout = createSavedLayout(name, layout);
      const updatedLayouts = [...savedLayouts, newLayout];

      setSavedLayouts(updatedLayouts);
      await saveSavedLayouts(updatedLayouts);
      setCurrentLayoutName(name);

      Alert.alert('Success', `Layout "${name}" saved successfully!`);
    } catch (error) {
      console.error('Error saving layout:', error);
      Alert.alert('Error', 'Failed to save layout');
    }
  };

  /**
   * Loads a saved layout
   */
  const handleLoadLayout = (layoutData: SavedLayout) => {
    setLayout(layoutData.layout);
    setCurrentLayoutName(layoutData.name);
    handleSaveCurrentLayout();
  };

  /**
   * Deletes a saved layout
   */
  const handleDeleteLayout = (layoutId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this layout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedLayouts = savedLayouts.filter(l => l.id !== layoutId);
              setSavedLayouts(updatedLayouts);
              await saveSavedLayouts(updatedLayouts);
            } catch (error) {
              console.error('Error deleting layout:', error);
            }
          }
        }
      ]
    );
  };

  /**
   * Adds a new button to the layout
   */
  const handleAddButton = () => {
    if (!newLabel.trim()) {
      Alert.alert('Error', 'Please enter a button label');
      return;
    }

    const newButton = createNewButton(newType, newLabel, buttonConfig);
    const updatedLayout = [...layout, newButton];

    setLayout(updatedLayout);
    setNewLabel('');
    setShowAddModal(false);

    // Save after a short delay to ensure state is updated
    setTimeout(() => handleSaveCurrentLayout(), 100);
  };

  /**
   * Removes a button from the layout
   */
  const handleRemoveButton = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to remove this button?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedLayout = removeButton(layout, id);
            setLayout(updatedLayout);
            setTimeout(() => handleSaveCurrentLayout(), 100);
          }
        }
      ]
    );
  };

  /**
   * Updates button position
   */
  const handleUpdateButtonPosition = (id: string, x: number, y: number) => {
    const updatedLayout = updateButtonPosition(layout, id, x, y);
    setLayout(updatedLayout);
    setTimeout(() => handleSaveCurrentLayout(), 100);
  };

  /**
   * Opens edit modal for a button
   */
  const handleEditButton = (index: number) => {
    const button = layout[index];
    setEditingIndex(index);
    setNewLabel(button.label);
    setNewType(button.type);
    setButtonConfig(getButtonConfig(button));
    setShowEditModal(true);
  };

  /**
   * Updates a button configuration
   */
  const handleUpdateButton = () => {
    if (!newLabel.trim()) {
      Alert.alert('Error', 'Please enter a button label');
      return;
    }

    if (editingIndex === null) return;

    const updatedLayout = updateButtonConfig(layout, editingIndex, newLabel, newType, buttonConfig);
    setLayout(updatedLayout);
    setShowEditModal(false);
    setEditingIndex(null);
    setNewLabel('');
    handleSaveCurrentLayout();
  };

  /**
   * Updates slider value for a button
   */
  const handleSliderValueChange = (id: string, value: number) => {
    const updatedLayout = updateSliderValue(layout, id, value);
    setLayout(updatedLayout);
    setTimeout(() => handleSaveCurrentLayout(), 100);
  };
  /**
   * Resets layout to default gamepad layout
   */
  const handleResetToGamepad = () => {
    Alert.alert(
      'Reset Layout',
      'Are you sure you want to reset to the default gamepad layout? This will remove all custom buttons.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setLayout(createGamepadLayout());
            setCurrentLayoutName('Gamepad');
            handleSaveCurrentLayout();
          }
        }
      ]
    );
  };


  const handleCancelModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setNewLabel('');
    setButtonConfig(DEFAULT_BUTTON_CONFIG);
  };

  const handleSaveLayoutModal = (name: string) => {
    handleSaveLayoutWithName(name);
    setShowSaveModal(false);
    setSaveLayoutName('');
  };

  const handleCancelSaveModal = () => {
    setShowSaveModal(false);
    setSaveLayoutName('');
  };  /**
   * Updates the input states based on gamepad events
   * This is the same function used in GamepadViewer for handling physical gamepad input
   * Now also forwards data to the same Bluetooth/UDP transmission system
   */
  const updateInputs = (evt: { [key: string]: any }) => {
    setGamepadInputs(prev => ({ ...prev, ...evt }));

    // Update last input indicator for visual feedback
    const inputKeys = Object.keys(evt);
    if (inputKeys.length > 0) {
      const activeInputs = inputKeys.filter(key => evt[key] !== 0);
      if (activeInputs.length > 0) {
        setLastPhysicalInput(`Physical Input: ${activeInputs.join(', ')}`);
      }
    }

    // Log for debugging - Physical gamepad input
    console.log('🎮 Physical gamepad input:', evt);

    // Forward physical gamepad input to the same transmission system
    // This uses the same formatMessage function and transmission intervals as virtual buttons
    Object.keys(evt).forEach(key => {
      const value = evt[key];
      if (value !== undefined) {
        // For buttons (0 or 1), treat as button press
        if (key.match(/^\d+$/)) { // Button keycodes are numeric strings
          handleButtonPress(`physical_btn_${key}`, value === 1);
        } else {
          // For analog inputs (joysticks, triggers), pass directly
          handleJoystickMove(`physical_${key}`, value / 1000, 0); // Scale back from -1000/1000 to -1/1
        }
      }
    });

    // EXAMPLE: Auto-trigger virtual buttons based on physical gamepad input
    // Uncomment and modify the following section to map physical inputs to virtual button presses

    /*
    // Example 1: Map physical A button (keyCode 96) to virtual button press
    if (evt['96'] === 1) { // Physical A button pressed
      // Find virtual button with id 'action-a' and trigger its action
      const virtualButton = layout.find(button => button.id === 'action-a');
      if (virtualButton) {
        console.log('Virtual A button triggered by physical input');
        // You can add your virtual button action logic here
      }
    }
    
    // Example 2: Map physical joystick movement to virtual joystick
    if (evt.leftX !== undefined || evt.leftY !== undefined) {
      // Handle left joystick movement
      const leftX = evt.leftX || 0;
      const leftY = evt.leftY || 0;
      console.log(`Physical left joystick: X=${leftX}, Y=${leftY}`);
      // Update virtual joystick position or trigger movement actions
    }
    
    // Example 3: Map physical D-pad to virtual D-pad
    if (evt.hatX !== undefined || evt.hatY !== undefined) {
      const hatX = evt.hatX || 0;
      const hatY = evt.hatY || 0;
      if (hatX < 0) console.log('Virtual D-pad LEFT triggered by physical input');
      if (hatX > 0) console.log('Virtual D-pad RIGHT triggered by physical input');
      if (hatY < 0) console.log('Virtual D-pad UP triggered by physical input');
      if (hatY > 0) console.log('Virtual D-pad DOWN triggered by physical input');
    }
    */
  };


  return (
    <View style={styles.container}>
      <Header
        currentLayoutName={currentLayoutName}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onAddButton={() => setShowAddModal(true)}
        onResetToGamepad={handleResetToGamepad}
        onSaveLayout={() => setShowSaveModal(true)}
        savedLayouts={savedLayouts}
        onLoadLayout={handleLoadLayout}
        onDeleteLayout={handleDeleteLayout}
      />
      <Canvas
        layout={layout}
        isEditMode={isEditMode}
        onUpdatePosition={handleUpdateButtonPosition}
        onEditButton={handleEditButton}
        onRemoveButton={handleRemoveButton}
        onSliderValueChange={handleSliderValueChange}
        onButtonPress={handleButtonPress}
        onJoystickMove={handleJoystickMove}
        onSliderChange={handleSliderChange}
      />

      <ButtonConfigModal
        visible={showAddModal || showEditModal}
        isEditMode={showEditModal}
        label={newLabel}
        buttonType={newType}
        config={buttonConfig}
        onChangeLabel={setNewLabel}
        onChangeButtonType={setNewType}
        onChangeConfig={setButtonConfig}
        onSave={showEditModal ? handleUpdateButton : handleAddButton}
        onCancel={handleCancelModal}
      />

      <SaveLayoutModal
        visible={showSaveModal}
        layoutName={saveLayoutName}
        onChangeLayoutName={setSaveLayoutName}
        onSave={handleSaveLayoutModal}
        onCancel={handleCancelSaveModal}
      />

      {/* Display physical input indicator */}
      {lastPhysicalInput ? (
        <View style={styles.physicalInputContainer}>
          <Text style={styles.physicalInputText}>{lastPhysicalInput}</Text>
        </View>
      ) : null}

      {/* Display current data transmission */}
      <View style={styles.dataTransmissionContainer}>
        <Text style={styles.dataTransmissionText}>
          📡 Data: {formatMessage({ ...buttonStates, ...joystickData })}
        </Text>
        <Text style={styles.dataTransmissionText}>
          🎮 Buttons: {Object.keys(buttonStates).length} | 🕹️ Analog: {Object.keys(joystickData).length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a', // Very dark background to match gamepad image
    // Remove paddingTop since we're handling immersive mode
  },
  physicalInputContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 255, 0, 0.8)',
    padding: 10, borderRadius: 5,
    zIndex: 1000,
  },
  physicalInputText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dataTransmissionContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  dataTransmissionText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});

export default CustomJoystickScreen;