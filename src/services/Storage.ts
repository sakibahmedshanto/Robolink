import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (value:string) => {
  try {
    await AsyncStorage.setItem('@access_token', value);
  } catch (e) {
    // saving error
    console.log('Error storing token:', e);
  }
};

export const deleteToken = async () => {
  try {
    await AsyncStorage.removeItem('@access_token');
  } catch (e) {
    // saving error
    console.log('Error deleting token:', e);
  }
}

export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('@access_token');
    if(value !== null) {
      return value;
    }
  } catch(e) {
    // error reading value
    console.log('Error retrieving token:', e);
  }
  return null;
};