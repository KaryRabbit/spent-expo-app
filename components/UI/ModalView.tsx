import React from 'react';

import { Modal, StyleSheet, Text, View } from 'react-native';
import colors from '../../colors';
import { ModalProps } from '../../types';
import CustomButton from './CustomButton';
const ModalView = ({ text, modalVisible, setModalVisible }: ModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{text}</Text>
          <CustomButton
            iconName="close"
            title="Close"
            onPress={() => setModalVisible(!modalVisible)}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalView;

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    marginHorizontal: 24,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 32,
    paddingBottom: 16,
    alignItems: 'center',
    shadowColor: colors.disabledText,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 8,
    textAlign: 'center',
  },
});
