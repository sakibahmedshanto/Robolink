import React, { useState, useEffect } from 'react';
// Button type definition
type JoystickButton = {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  config?: {
    direction?: string;
    action?: string;
    sensitivity?: number;
    customCommand?: string;
  };
};
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  ScrollView,
  Modal,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Gesture, GestureDetector, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import DirectionButton from '../components/DirectionButton';
import ActionButton from '../components/ActionButton';
import ToggleButton from '../components/ToggleButton';
import SliderButton from '../components/SliderButton';
import VirtualJoystick from '../components/VirtualJoystick';

const BUTTON_TYPES = [
  { type: 'direction', label: 'Direction', icon: '↑' },
  { type: 'action', label: 'Action', icon: '●' },
  { type: 'toggle', label: 'Toggle', icon: '⚡' },
  { type: 'slider', label: 'Slider', icon: '═' },
  { type: 'joystick', label: 'Joystick', icon: '🕹️' },
];

const DIRECTION_OPTIONS = ['up', 'down', 'left', 'right', 'forward', 'backward', 'rotate_left', 'rotate_right'];
const ACTION_OPTIONS = ['fire', 'grab', 'release', 'horn', 'lights', 'camera', 'custom'];

interface SavedLayout {
  id: string;
  name: string;
  layout: JoystickButton[];
  createdAt: string;
}

const CustomJoystickScreen = () => {
  const screen = Dimensions.get('window');
  const [layout, setLayout] = useState<JoystickButton[]>([]);
  const [newType, setNewType] = useState('direction');
  const [newLabel, setNewLabel] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [currentLayoutName, setCurrentLayoutName] = useState('Default');
  const [isEditMode, setIsEditMode] = useState(false);  const [gridSnap, setGridSnap] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  
  // Button configuration states
  const [buttonConfig, setButtonConfig] = useState({
    direction: 'up',
    action: 'fire',
    size: 60,
    color: '#007AFF',
    sensitivity: 50,
    customCommand: '',
  });

  useEffect(() => {
    loadSavedLayouts();
    loadCurrentLayout();
  }, []);

  const loadSavedLayouts = async () => {
    try {
      const layouts = await AsyncStorage.getItem('customLayouts');
      if (layouts) {
        setSavedLayouts(JSON.parse(layouts));
      }
    } catch (error) {
      console.error('Error loading layouts:', error);
    }
  };

  const loadCurrentLayout = async () => {
    try {
      const currentLayout = await AsyncStorage.getItem('currentLayout');      if (currentLayout) {
        setLayout(JSON.parse(currentLayout));
      } else {
        // Default layout
        setLayout([
          { 
            id: '1',
            type: 'joystick', 
            label: 'Movement', 
            x: 80.50, 
            y: screen.height - 200.25,
            size: 80,
            color: '#007AFF',
            config: { sensitivity: 50 }
          },
          { 
            id: '2',
            type: 'action', 
            label: 'Fire', 
            x: screen.width - 120.75, 
            y: screen.height - 200.25,
            size: 60,
            color: '#FF3B30',
            config: { action: 'fire' }
          },
          { 
            id: '3',
            type: 'toggle', 
            label: 'Lights', 
            x: screen.width - 120.75, 
            y: screen.height - 120.50,
            size: 50,
            color: '#FF9500',
            config: { action: 'lights' }
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading current layout:', error);
    }
  };

  const saveCurrentLayout = async () => {
    try {
      await AsyncStorage.setItem('currentLayout', JSON.stringify(layout));
    } catch (error) {
      console.error('Error saving current layout:', error);
    }
  };

  const saveLayoutWithName = async (name: string) => {
    try {
      const newLayout = {
        id: Date.now().toString(),
        name,
        layout: layout,
        createdAt: new Date().toISOString(),
      };
      
      const updatedLayouts = [...savedLayouts, newLayout];
      setSavedLayouts(updatedLayouts);
      await AsyncStorage.setItem('customLayouts', JSON.stringify(updatedLayouts));
      setCurrentLayoutName(name);
      Alert.alert('Success', `Layout "${name}" saved successfully!`);
    } catch (error) {
      console.error('Error saving layout:', error);
      Alert.alert('Error', 'Failed to save layout');
    }
  };

  const loadLayout = (layoutData: SavedLayout) => {
    setLayout(layoutData.layout);
    setCurrentLayoutName(layoutData.name);
    saveCurrentLayout();
  };

  const deleteLayout = (layoutId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this layout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const updatedLayouts = savedLayouts.filter(l => l.id !== layoutId);
            setSavedLayouts(updatedLayouts);
            await AsyncStorage.setItem('customLayouts', JSON.stringify(updatedLayouts));
          }
        }
      ]
    );
  };
  const snapToGrid = (value: number) => {
    if (!gridSnap) return parseFloat(value.toFixed(2));
    return Math.round(value / gridSize) * gridSize;
  };

  const addButton = (): void => {
    if (!newLabel.trim()) {
      Alert.alert('Error', 'Please enter a button label');
      return;
    }

    const newButton = {
      id: Date.now().toString(),
      type: newType,
      label: newLabel,
      x: snapToGrid(screen.width / 2 - 40),
      y: snapToGrid(screen.height / 2),
      size: buttonConfig.size,
      color: buttonConfig.color,
      config: {
        direction: buttonConfig.direction,
        action: buttonConfig.action,
        sensitivity: buttonConfig.sensitivity,
        customCommand: buttonConfig.customCommand,
      },
    };

    setLayout([...layout, newButton]);
    setNewLabel('');
    setShowAddModal(false);
    saveCurrentLayout();
  };
  const removeButton = (id: string): void => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to remove this button?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setLayout(prevLayout => prevLayout.filter(item => item.id !== id));
            setTimeout(() => saveCurrentLayout(), 100);
          }
        }
      ]
    );
  };const updateButtonPosition = (id: string, x: number, y: number): void => {
    const snappedX = snapToGrid(x);
    const snappedY = snapToGrid(y);
    
    setLayout(prevLayout => {
      const updated = prevLayout.map(item =>
        item.id === id ? { ...item, x: snappedX, y: snappedY } : item
      );
      return updated;
    });
    
    // Save layout separately to avoid worklet issues
    setTimeout(() => saveCurrentLayout(), 100);
  };

  const editButton = (index: number): void => {
    const button = layout[index];
    setEditingIndex(index);
    setNewLabel(button.label);
    setNewType(button.type);
    setButtonConfig({
      direction: button.config?.direction || 'up',
      action: button.config?.action || 'fire',
      size: button.size || 60,
      color: button.color || '#007AFF',
      sensitivity: button.config?.sensitivity || 50,
      customCommand: button.config?.customCommand || '',
    });
    setShowEditModal(true);
  };

  const updateButton = (): void => {
    if (!newLabel.trim()) {
      Alert.alert('Error', 'Please enter a button label');
      return;
    }

    const updatedLayout = layout.map((item, index) => {
      if (index === editingIndex) {
        return {
          ...item,
          label: newLabel,
          type: newType,
          size: buttonConfig.size,
          color: buttonConfig.color,
          config: {
            direction: buttonConfig.direction,
            action: buttonConfig.action,
            sensitivity: buttonConfig.sensitivity,
            customCommand: buttonConfig.customCommand,
          },
        };
      }
      return item;
    });

    setLayout(updatedLayout);
    setShowEditModal(false);
    setEditingIndex(null);
    setNewLabel('');
    saveCurrentLayout();
  };
  const renderButtonComponent = (item: JoystickButton): React.ReactElement => {
    const commonProps = {
      label: item.label,
      size: item.size,
      color: item.color,
      ...item.config,
    };

    switch (item.type) {
      case 'direction':
        return <DirectionButton {...commonProps} />;
      case 'action':
        return <ActionButton {...commonProps} />;
      case 'toggle':
        return <ToggleButton {...commonProps} />;      case 'slider':
        return <SliderButton {...commonProps} value={item.config?.sensitivity || 50} onValueChange={(value: number) => {
          // Update the button's sensitivity in the layout
          const updatedLayout = layout.map(layoutItem =>
            layoutItem.id === item.id 
              ? { ...layoutItem, config: { ...layoutItem.config, sensitivity: value } }
              : layoutItem
          );
          setLayout(updatedLayout);
          // Use setTimeout to avoid potential worklet issues
          setTimeout(() => saveCurrentLayout(), 100);
        }} />;
      case 'joystick':
        return <VirtualJoystick {...commonProps} />;
      default:
        return <ActionButton {...commonProps} />;
    }
  };  // Animated Button Component using Gesture Handler
  const AnimatedButton = ({ item, index }: { item: JoystickButton; index: number }) => {
    const translateX = useSharedValue(item.x);
    const translateY = useSharedValue(item.y);
    const startPosition = useSharedValue({ x: 0, y: 0 });    React.useEffect(() => {
      translateX.value = item.x;
      translateY.value = item.y;
    }, [item.x, item.y, translateX, translateY]);const panGesture = Gesture.Pan()
      .enabled(isEditMode)
      .onStart(() => {
        startPosition.value = { x: translateX.value, y: translateY.value };
      })
      .onUpdate((event) => {
        translateX.value = startPosition.value.x + event.translationX;
        translateY.value = startPosition.value.y + event.translationY;
      })
      .onEnd(() => {
        const finalX = translateX.value;
        const finalY = translateY.value;
        
        // Apply snapping on the JS thread
        runOnJS(updateButtonPosition)(item.id, finalX, finalY);
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    }));

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.draggableContainer, animatedStyle, { position: 'absolute', left: 0, top: 0 }]}>
          {renderButtonComponent(item)}
          {isEditMode && (
            <View style={styles.editControls}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => editButton(index)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeButton(item.id)}
              >
                <Text style={styles.removeBtnText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    );
  };

  const renderGrid = () => {
    if (!gridSnap) return null;
    
    const lines = [];
    for (let i = 0; i <= screen.width; i += gridSize) {
      lines.push(
        <View
          key={`v-${i}`}
          style={[styles.gridLine, { left: i, height: screen.height }]}
        />
      );
    }
    for (let i = 0; i <= screen.height; i += gridSize) {
      lines.push(
        <View
          key={`h-${i}`}
          style={[styles.gridLine, { top: i, width: screen.width }]}
        />
      );
    }
    return lines;
  };
  const renderConfigModal = () => {
    const ModalContent = gestureHandlerRootHOC(() => (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>
              {showEditModal ? 'Edit Button' : 'Add New Button'}
            </Text>

            <Text style={styles.configLabel}>Label:</Text>
            <TextInput
              style={styles.input}
              placeholder="Button Label"
              value={newLabel}
              onChangeText={setNewLabel}
            />

            <Text style={styles.configLabel}>Type:</Text>
            <View style={styles.typePicker}>
              {BUTTON_TYPES.map(btn => (
                <TouchableOpacity
                  key={btn.type}
                  style={[
                    styles.typeButton,
                    newType === btn.type && styles.typeButtonActive,
                  ]}
                  onPress={() => setNewType(btn.type)}
                >
                  <Text style={styles.typeIcon}>{btn.icon}</Text>
                  <Text style={styles.typeButtonText}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.configLabel}>Size:</Text>
            <View style={styles.sliderContainer}>
              <Text>{buttonConfig.size}</Text>
              <SliderButton
                value={buttonConfig.size}
                minimumValue={30}
                maximumValue={120}
                onValueChange={(value: number) => setButtonConfig({...buttonConfig, size: value})}
                label="Size"
              />
            </View>

            <Text style={styles.configLabel}>Color:</Text>
            <View style={styles.colorPicker}>
              {['#007AFF', '#FF3B30', '#FF9500', '#34C759', '#5856D6', '#AF52DE'].map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    buttonConfig.color === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => setButtonConfig({...buttonConfig, color})}
                />
              ))}
            </View>

            {newType === 'direction' ? (
              <>
                <Text style={styles.configLabel}>Direction:</Text>
                <Picker
                  selectedValue={buttonConfig.direction}
                  style={styles.picker}
                  onValueChange={(value) => setButtonConfig({...buttonConfig, direction: value})}
                >
                  {DIRECTION_OPTIONS.map(dir => (
                    <Picker.Item key={dir} label={dir.replace('_', ' ')} value={dir} />
                  ))}
                </Picker>
              </>
            )
          : null}

            {newType === 'action' ? (
              <>
                <Text style={styles.configLabel}>Action:</Text>
                <Picker
                  selectedValue={buttonConfig.action}
                  style={styles.picker}
                  onValueChange={(value) => setButtonConfig({...buttonConfig, action: value})}
                >
                  {ACTION_OPTIONS.map(action => (
                    <Picker.Item key={action} label={action} value={action} />
                  ))}
                </Picker>
              </>
            ): null}

            {(newType === 'slider' || newType === 'joystick') ? (
              <>
                <Text style={styles.configLabel}>Sensitivity:</Text>
                <View style={styles.sliderContainer}>
                  <Text>{buttonConfig.sensitivity}</Text>                  <SliderButton
                    value={buttonConfig.sensitivity}
                    minimumValue={1}
                    maximumValue={100}
                    onValueChange={(value: number) => setButtonConfig({...buttonConfig, sensitivity: value})}
                    label="Sensitivity"
                  />
                </View>
              </>
            ) : null}

            <Text style={styles.configLabel}>Custom Command:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter custom command (optional)"
              value={buttonConfig.customCommand}
              onChangeText={(value) => setButtonConfig({...buttonConfig, customCommand: value})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setNewLabel('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={showEditModal ? updateButton : addButton}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>
                  {showEditModal ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    ));

    return (
      <Modal
        visible={showAddModal || showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
      >
        <ModalContent />
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Controls */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{currentLayoutName}</Text>
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setIsEditMode(!isEditMode)}
          >
            <Text style={styles.headerButtonText}>
              {isEditMode ? 'Done' : 'Edit'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.headerButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Panel */}
      {isEditMode ? (
        <View style={styles.settingsPanel}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Grid Snap:</Text>
            <Switch
              value={gridSnap}
              onValueChange={setGridSnap}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Grid Size:</Text>
            <View style={styles.gridSizeButtons}>
              {[10, 20, 30].map(size => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.gridSizeButton,
                    gridSize === size && styles.gridSizeButtonActive,
                  ]}
                  onPress={() => setGridSize(size)}
                >
                  <Text style={styles.gridSizeButtonText}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.settingRow}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                Alert.prompt(
                  'Save Layout',
                  'Enter a name for this layout:',
                  (name) => {
                    if (name && name.trim()) {
                      saveLayoutWithName(name.trim());
                    }
                  }
                );
              }}
            >
              <Text style={styles.saveButtonText}>Save Layout</Text>
            </TouchableOpacity>
          </View>
          </View>
      )
      : null}
      
      {/* Canvas */}
      <View style={styles.canvas}>
        {renderGrid()}
        
        {layout.map((item, idx) => (
          <AnimatedButton key={item.id} item={item} index={idx} />
        ))}
      </View>

      {/* Saved Layouts */}
      {savedLayouts.length > 0 ? (
        <View style={styles.savedLayouts}>
          <Text style={styles.savedLayoutsTitle}>Saved Layouts:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {savedLayouts.map(layout => (
              <View key={layout.id} style={styles.savedLayoutItem}>
                <TouchableOpacity
                  style={styles.savedLayoutButton}
                  onPress={() => loadLayout(layout)}
                >
                  <Text style={styles.savedLayoutButtonText}>{layout.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteSavedLayout}
                  onPress={() => deleteLayout(layout.id)}
                >
                  <Text style={styles.deleteSavedLayoutText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {renderConfigModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerControls: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  settingsPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  gridSizeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  gridSizeButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  gridSizeButtonActive: {
    backgroundColor: '#007AFF',
  },
  gridSizeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  canvas: {
    flex: 1,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#e0e0e0',
    opacity: 0.3,
  },
  draggableContainer: {
    alignItems: 'center',
  },
  editControls: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 4,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  removeBtn: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  savedLayouts: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  savedLayoutsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  savedLayoutItem: {
    flexDirection: 'row',
    marginRight: 8,
    alignItems: 'center',
  },
  savedLayoutButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  savedLayoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteSavedLayout: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  deleteSavedLayoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  configLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  typePicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    minWidth: 70,
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  typeButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#333',
  },
  picker: {
    height: 50,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  modalButtonPrimaryText: {
    color: '#fff',
  },
});

export default CustomJoystickScreen;