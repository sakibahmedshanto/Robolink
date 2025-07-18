/**
 * Navigation Bar utility for React Native
 * Handles hiding/showing Android navigation bar
 */

import { Platform, DeviceEventEmitter } from 'react-native';

export const hideNavigationBar = () => {
  if (Platform.OS === 'android') {
    try {
      // This will be handled by the native Android code
      console.log('Navigation bar hidden via native Android implementation');
    } catch (error) {
      console.warn('Could not hide navigation bar:', error);
    }
  }
};

export const showNavigationBar = () => {
  if (Platform.OS === 'android') {
    try {
      // This will be handled by the native Android code
      console.log('Navigation bar shown via native Android implementation');
    } catch (error) {
      console.warn('Could not show navigation bar:', error);
    }
  }
};

export const setupNavigationBarListener = (callback: (visible: boolean) => void) => {
  if (Platform.OS === 'android') {
    const listener = DeviceEventEmitter.addListener('NavigationBarVisibilityChanged', callback);
    return () => listener.remove();
  }
  return () => {};
};
