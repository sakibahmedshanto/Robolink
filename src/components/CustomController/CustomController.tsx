import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions, // Import Dimensions for dynamic sizing
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import VSliderComponent, { VSliderWidget } from './VSliderComponent';
import JoystickComponent, { JoystickWidget } from './JoystickComponent';
import ToggleComponent, { ToggleWidget } from './ToggleButtonComponent';
import ButtonComponent, { ButtonWidget } from './ButtonComponent';
import HSliderComponent, { HSliderWidget } from './HSliderComponent';


type Widget = JoystickWidget | ButtonWidget | ToggleWidget | HSliderWidget | VSliderWidget;

interface ControllerLayout {
  templateId: string;
  layoutName: string;
  widgets: Widget[];
}

interface ControllerProps {
  layout: ControllerLayout;
  onWidgetInteraction?: (widgetId: string, type: string, value: any) => void;
}


// Main Controller Component
const CustomController: React.FC<ControllerProps> = ({ layout, onWidgetInteraction }) => {
  // Get the full width and height of the device screen
  const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

  const handleWidgetInteraction = (widgetId: string, type: string, value: any) => {
    onWidgetInteraction?.(widgetId, type, value);
  };

  const renderWidget = (widget: Widget) => {
    // Calculate absolute left and top positions based on device dimensions
    const absoluteLeft = (widget.x / 100) * deviceWidth;
    const absoluteTop = (widget.y / 100) * deviceHeight;

    switch (widget.type) {
      case 'JOYSTICK':
        return (
          <JoystickComponent
            key={widget.id}
            widget={widget as JoystickWidget}
            absoluteLeft={absoluteLeft}
            absoluteTop={absoluteTop}
            onValueChange={(x, y) => handleWidgetInteraction(widget.id, 'joystick', { x, y })}
          />
        );

      case 'BUTTON':
      case 'GPBUTTON':
        return (
          <ButtonComponent
            key={widget.id}
            widget={widget as ButtonWidget}
            absoluteLeft={absoluteLeft}
            absoluteTop={absoluteTop}
            onPress={() => handleWidgetInteraction(widget.id, 'button_press', true)}
            onPressIn={() => handleWidgetInteraction(widget.id, 'button_down', true)}
            onPressOut={() => handleWidgetInteraction(widget.id, 'button_up', false)}
          />
        );

      case 'TOGGLE':
        return (
          <ToggleComponent
            key={widget.id}
            widget={widget as ToggleWidget}
            absoluteLeft={absoluteLeft}
            absoluteTop={absoluteTop}
            onToggle={(value) => handleWidgetInteraction(widget.id, 'toggle', value)}
          />
        );

      case 'HSLIDER':
        return (
          <HSliderComponent
            key={widget.id}
            widget={widget as HSliderWidget}
            absoluteLeft={absoluteLeft}
            absoluteTop={absoluteTop}
            onValueChange={(value) => handleWidgetInteraction(widget.id, 'slider', value)}
          />
        );
      case 'VSLIDER':
        return (
          <VSliderComponent
            key={widget.id}
            widget={widget as VSliderWidget}
            absoluteLeft={absoluteLeft}
            absoluteTop={absoluteTop}
            onValueChange={(value) => handleWidgetInteraction(widget.id, 'slider', value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    // GestureHandlerRootView should wrap the entire application
    <View style={{ flexGrow: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#F5F5F5',
            // The main container now takes up the full device width and height
            width: deviceWidth,
            height: deviceHeight -10,
            position: 'relative', // Important for absolute positioning of children
          }}
        >
          {/* Controller Area - widgets are rendered here */}
          {/* This inner view acts as the 'canvas' and will stretch to fill the device dimensions */}
          <View
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF', // White background for the canvas itself
              position: 'relative', // Important for absolute positioning of children
              borderWidth: 1,
              borderColor: '#E0E0E0',
              borderRadius: 10,
              overflow: 'hidden', // Clip content outside bounds
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 5,
            }}
          >
            {layout.widgets.map(renderWidget)}
          </View>
        </View>
    </View>
  );
};

export default CustomController;
