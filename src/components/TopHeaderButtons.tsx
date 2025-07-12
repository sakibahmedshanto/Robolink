import { View, Text, ScrollView, Modal, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import MyButton from './Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { primaryColor } from '../const/theme';
import { arduinoCodeForBluetooth, esp32CodeForBluetooth } from '../const/code';
import Clipboard from '@react-native-clipboard/clipboard';
import { showToast } from './toast';

type TopHeaderButtonsProps = {
  enableCheck: boolean;
  onCheckPress: () => void;
};

export default function TopHeaderButtons({
  enableCheck,
  onCheckPress,
}: TopHeaderButtonsProps) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <MyButton
        style={{ backgroundColor: '#ffffff2a' }}
        children={<Icon name="code" size={20} color="#fff" />}
        onPress={() => setModalVisible(true)}
      />
      <MyButton
        style={{ backgroundColor: '#ffffff2a' }}
        children={
          <Icon
            name={enableCheck ? 'edit' : 'edit-off'}
            size={20}
            color="#fff"
          />
        }
        onPress={onCheckPress}
      />
      <CodeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const CodeModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [showCodeFor, setShowCodeFor] = useState<'arduino-bt' | 'esp32-bt' | 'esp32-udp'>('arduino-bt');
  const [sampleCode, setSampleCode] = useState<string>(arduinoCodeForBluetooth);

  useEffect(() => {
    setSampleCode(showCodeFor == 'arduino-bt'
              ? arduinoCodeForBluetooth
              : showCodeFor == 'esp32-udp'
              ? 'ESP32 UDP code will be added soon.'
              : esp32CodeForBluetooth
    )
  }, [showCodeFor]);
  const copyToClipboard = () => {
    Clipboard.setString(sampleCode);
    showToast('Code copied to clipboard');
  };
  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingTop: 8,
        }}
      >
        <MyButton
          style={{
            backgroundColor:
              showCodeFor == 'arduino-bt' ? '#fe00002a' : '#0000002a',
            marginHorizontal: 2,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          title="Arduino Bluetooth"
          onPress={() => setShowCodeFor('arduino-bt')}
        />
        <MyButton
          style={{
            backgroundColor:
              showCodeFor == 'esp32-bt' ? '#fe00002a' : '#0000002a',
            marginHorizontal: 2,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          title="Esp32 Bluetooth"
          onPress={() => setShowCodeFor('esp32-bt')}
        />
        <MyButton
          style={{
            backgroundColor:
              showCodeFor == 'esp32-udp' ? '#fe00002a' : '#0000002a',
            marginHorizontal: 2,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          title="UDP"
          onPress={() => setShowCodeFor('esp32-udp')}
        />
      </View>
      <View style={{ flex: 1, padding: 8 }}>
        <ScrollView style={{ padding: 8 }}>
          <Text style={styles.codeText}>
            {sampleCode}
          </Text>
          <MyButton
            style={{
              backgroundColor: primaryColor,
              position: 'absolute',
              top: 10,
              right: 0,
            }}
            children={<Icon name={'content-copy'} size={20} color="#fff" />}
            onPress={copyToClipboard}
          />
        </ScrollView>
        <MyButton
          style={{
            backgroundColor: primaryColor,
            marginBottom: 8,
            paddingVertical: 8,
          }}
          onPress={onClose}
          title="Close"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  codeText: {
    fontFamily: 'monospace', // should be 'Courier New' on iOS
    fontSize: 12,
    color: '#333',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 4,
  },
});
