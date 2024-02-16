import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import colors from '../../colors';
import { InputProps } from '../../types';

const Input = ({ label, inputProps, invalid, style }: InputProps) => {
  let inputStyles = [styles.input];
  if (inputProps?.multiline) {
    inputStyles.push(styles.inputMultiLine);
  }

  if (invalid) {
    inputStyles.push(styles.invalidField);
  }

  return (
    <View>
      <TextInput
        style={[inputStyles, style]}
        placeholder={label}
        {...inputProps}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 16,
    fontSize: 16,
    minHeight: 48,
    maxHeight: 300,
  },
  inputMultiLine: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  invalidField: {
    borderColor: colors.accent,
    borderWidth: 1,
  },
});
