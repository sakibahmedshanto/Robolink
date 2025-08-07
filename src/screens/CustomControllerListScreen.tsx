import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { primaryColor, secondaryColor } from '../const/theme';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Header } from '@react-navigation/elements';
import { getToken } from '../services/Storage';
import { serverUrl } from '../const/const';

export default function CustomControllerListScreen() {
    const isDarkMode = useColorScheme() === 'dark';
    const [layouts, setLayouts] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        async function getLayouts() {
            const token = await getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
    
            fetch(`${serverUrl}/api/user/layouts`, options)
                .then(response => response.json())
                .then(response => {
                    console.log(response.layouts);
                    setLayouts(response.layouts || []);
                })
                .catch(err => console.error("Error getting Layouts", err));
        }
        
        getLayouts();
        }, [])
  
    return (
              <SafeAreaView style={styles.safearea}>
                <ScrollView>
                  <View style={styles.container}>
                    <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                    </View>
                </ScrollView>
            </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: secondaryColor,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56, // Standard header height
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  rightPlaceholder: {
    width: 40, // Match the width of the back button for symmetrical layout
  },
});