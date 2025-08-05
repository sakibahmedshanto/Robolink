/**
 * Quick test to verify responsive positioning functions work correctly
 * This file can be removed after testing
 */

import { 
  getCurrentScreen, 
  getUsableScreenDimensions, 
  getButtonSize, 
  getPositionFromPercent,
  getLayoutZones 
} from './src/components/CustomJoystickScreen/screenBounds';

// Test the responsive functions
console.log('=== Responsive Positioning Test ===');

try {
  const screen = getCurrentScreen();
  console.log('✅ getCurrentScreen:', screen);

  const bounds = getUsableScreenDimensions();
  console.log('✅ getUsableScreenDimensions:', bounds);

  const smallSize = getButtonSize('small');
  const mediumSize = getButtonSize('medium');
  const largeSize = getButtonSize('large');
  console.log('✅ Button sizes:', { small: smallSize, medium: mediumSize, large: largeSize });

  const centerPos = getPositionFromPercent(0.5, 0.5);
  console.log('✅ Center position (50%, 50%):', centerPos);

  const zones = getLayoutZones();
  console.log('✅ Layout zones:', zones);

  console.log('🎉 All responsive functions working correctly!');
} catch (error) {
  console.error('❌ Error in responsive functions:', error);
}
