import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { primaryColor, secondaryColor } from '../const/theme';
import { getToken } from '../services/Storage';
import { serverUrl } from '../const/const';
import MyButton from '../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Layout } from '../types/layout';

export default function CustomControllerListScreen() {
    const isDarkMode = useColorScheme() === 'dark';
    const [layouts, setLayouts] = useState<Layout[]>([]);
    const navigation = useNavigation<any>();

    useEffect(() => {        
        getLayouts();
        }, [])
  
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

    return (
              <SafeAreaView style={styles.safearea}>
                <ScrollView style={{padding: 8}}>
                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  <MyButton children={<Icon name='arrows-rotate' color={'white'} style={{backgroundColor: primaryColor, borderRadius: 5, padding:12}} size={16} />} onPress={getLayouts} />
                </View>

                <View style={styles.container}>
                  <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                </View>

                <View>
                  {
                    layouts.map((layout) => (
                      <TouchableOpacity key={layout._id} style={{ marginBottom: 5, backgroundColor: '#ffffff0a', borderRadius: 5 }} onPress={() => navigation.navigate('CustomController', { layout })}>
                        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#444' : '#ccc' }}>
                          <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDarkMode ? '#fff' : '#000' }}>{layout.title}</Text>
                          <Text style={{ color: isDarkMode ? '#c0c0c0' : '#555' }}>{layout.description.length > 20 ? layout.description.slice(0, 20) + "..." : layout.description}</Text>
                          <Text style={{ color: isDarkMode ? '#989898' : '#555', fontSize: 11, paddingTop: 5 }}>Created at {layout.createdAt}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  }
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

