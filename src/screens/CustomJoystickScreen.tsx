/**
 * Custom Joystick Screen
 * Main screen component for creating and managing custom joystick layouts
 * Allows users to add, edit, position, and save custom button layouts
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';

// Component imports
import Header from '../components/CustomJoystickScreen/Header';
import SettingsPanel from '../components/CustomJoystickScreen/SettingsPanel';
import Canvas from '../components/CustomJoystickScreen/Canvas';
import SavedLayouts from '../components/CustomJoystickScreen/SavedLayouts';
import ButtonConfigModal from '../components/CustomJoystickScreen/ButtonConfigModal';
import SaveLayoutModal from '../components/CustomJoystickScreen/SaveLayoutModal';

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

const CustomJoystickScreen: React.FC = () => {
  // State management
  const [layout, setLayout] = useState<JoystickButton[]>([]);
  const [newType, setNewType] = useState<string>('direction');
  const [newLabel, setNewLabel] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [currentLayoutName, setCurrentLayoutName] = useState<string>('Default');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [saveLayoutName, setSaveLayoutName] = useState<string>('');

  // Button configuration state
  const [buttonConfig, setButtonConfig] = useState<ButtonConfig>(DEFAULT_BUTTON_CONFIG);

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
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
        setLayout(currentLayout);
      } else {
        setLayout(createDefaultLayout());
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setLayout(createDefaultLayout());
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
   * Handles modal cancellation
   */
  const handleCancelModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setNewLabel('');
    setButtonConfig(DEFAULT_BUTTON_CONFIG);
  };

  /**
   * Handles save layout modal actions
   */
  const handleSaveLayoutModal = (name: string) => {
    handleSaveLayoutWithName(name);
    setShowSaveModal(false);
    setSaveLayoutName('');
  };

  const handleCancelSaveModal = () => {
    setShowSaveModal(false);
    setSaveLayoutName('');
  };

  return (
    <View style={styles.container}>
      {/* Header with controls */}
      <Header
        currentLayoutName={currentLayoutName}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onAddButton={() => setShowAddModal(true)}
      />

      {/* Settings panel (visible only in edit mode) */}
      <SettingsPanel
        isEditMode={isEditMode}
        onSaveLayout={() => setShowSaveModal(true)}
      />

      {/* Canvas with draggable buttons */}
      <Canvas
        layout={layout}
        isEditMode={isEditMode}
        onUpdatePosition={handleUpdateButtonPosition}
        onEditButton={handleEditButton}
        onRemoveButton={handleRemoveButton}
        onSliderValueChange={handleSliderValueChange}
      />

      {/* Saved layouts */}
      <SavedLayouts
        savedLayouts={savedLayouts}
        onLoadLayout={handleLoadLayout}
        onDeleteLayout={handleDeleteLayout}
      />

      {/* Button configuration modal */}
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

      {/* Save layout modal */}
      <SaveLayoutModal
        visible={showSaveModal}
        layoutName={saveLayoutName}
        onChangeLayoutName={setSaveLayoutName}
        onSave={handleSaveLayoutModal}
        onCancel={handleCancelSaveModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});

export default CustomJoystickScreen;