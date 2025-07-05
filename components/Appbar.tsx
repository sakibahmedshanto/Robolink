import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Appbar = ({
    title = 'Robolink',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        height: 70,
        backgroundColor: '#f5f5f5',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 20,
        paddingHorizontal: 16,
        fontWeight: 'bold',
        paddingBottom: 10,
    },
    })
export default Appbar