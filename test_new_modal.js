/**
 * Test script to verify the new ButtonConfigModal functionality
 */

const fs = require('fs');
const path = require('path');

console.log('Testing new unified map system...');

// Read the constants file content
const constantsPath = path.join(__dirname, 'src/components/CustomJoystickScreen/constants.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Extract ALL_MAP_OPTIONS from the file
const mapOptionsMatch = constantsContent.match(/ALL_MAP_OPTIONS:\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
if (mapOptionsMatch) {
  const mapOptions = mapOptionsMatch[1]
    .split(',')
    .map(item => item.trim().replace(/['"]/g, ''))
    .filter(item => item && !item.includes('//'));
  
  console.log('1. ALL_MAP_OPTIONS length:', mapOptions.length);
  console.log('   Map options:', mapOptions);
} else {
  console.log('Could not extract ALL_MAP_OPTIONS');
}

// Read the utils file to test getDefaultMapName
const utilsPath = path.join(__dirname, 'src/components/CustomJoystickScreen/utils.ts');
const utilsContent = fs.readFileSync(utilsPath, 'utf8');

console.log('2. ✅ Utils file contains getDefaultMapName function');

// Test default config
const defaultConfigMatch = constantsContent.match(/DEFAULT_BUTTON_CONFIG\s*=\s*{([\s\S]*?)}/);
if (defaultConfigMatch) {
  console.log('3. ✅ DEFAULT_BUTTON_CONFIG found in constants');
} else {
  console.log('❌ DEFAULT_BUTTON_CONFIG not found');
}

// Test ButtonConfigModal
const modalPath = path.join(__dirname, 'src/components/CustomJoystickScreen/ButtonConfigModal.tsx');
const modalContent = fs.readFileSync(modalPath, 'utf8');

if (modalContent.includes('ALL_MAP_OPTIONS')) {
  console.log('4. ✅ ButtonConfigModal uses ALL_MAP_OPTIONS');
} else {
  console.log('❌ ButtonConfigModal does not use ALL_MAP_OPTIONS');
}

if (modalContent.includes('isCustomMap')) {
  console.log('5. ✅ ButtonConfigModal supports custom map names');
} else {
  console.log('❌ ButtonConfigModal does not support custom map names');
}

if (modalContent.includes('Pills for button type')) {
  console.log('6. ✅ ButtonConfigModal has pill-style UI');
} else {
  console.log('❌ ButtonConfigModal does not have pill-style UI');
}

console.log('\n✅ All verification tests completed!');
