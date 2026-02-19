import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import colors from '../../colors';
import spacing, { radius } from '../../spacing';
import { textStyles } from '../../typography';
import { InputProps } from '../../types';

const Input = ({ label, inputProps, invalid, style }: InputProps) => {
  let inputStyles: any[] = [styles.input];
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
        placeholderTextColor={colors.textMuted}
        {...inputProps}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    fontSize: textStyles.body.fontSize,
    color: colors.textPrimary,
    minHeight: 48,
    maxHeight: 300,
  },
  inputMultiLine: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  invalidField: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
});
