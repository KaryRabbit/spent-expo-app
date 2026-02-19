import React from 'react';

import { Modal, StyleSheet, Text, View } from 'react-native';
import colors from '../../colors';
import shadows from '../../shadows';
import spacing, { radius } from '../../spacing';
import { textStyles } from '../../typography';
import { ModalProps } from '../../types';
import CustomButton from './CustomButton';
const ModalView = ({ text, modalVisible, setModalVisible }: ModalProps) => {
  return (
    <Modal
      animationType="fade"
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
    backgroundColor: colors.overlay,
  },
  modalView: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.xl,
  },
  modalText: {
    marginBottom: spacing.md,
    textAlign: 'center',
    color: colors.textPrimary,
    fontSize: textStyles.body.fontSize,
    lineHeight: 24,
  },
});
