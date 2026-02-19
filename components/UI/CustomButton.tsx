import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../colors';
import shadows from '../../shadows';
import spacing, { radius } from '../../spacing';
import { textStyles } from '../../typography';
import { CustomButtonProps } from '../../types';

const CustomButton = ({
  title,
  onPress,
  iconName,
  color = colors.primary,
  disabled = false,
  style,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.buttonContainer,
        disabled ? styles.buttonDisabled : { backgroundColor: color },
        style,
      ]}
    >
      <View style={styles.buttonBody}>
        <Ionicons
          name={iconName as any}
          size={20}
          color={disabled ? colors.disabledText : colors.textInverse}
        />
        <Text style={[styles.text, disabled && styles.disabledText]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: radius.md,
    overflow: 'hidden',
    marginVertical: spacing.xs,
    ...shadows.sm,
  },
  buttonBody: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  text: {
    color: colors.textInverse,
    fontSize: textStyles.button.fontSize,
    fontWeight: textStyles.button.fontWeight,
    letterSpacing: 0.3,
  },
  disabledText: {
    color: colors.disabledText,
  },
});

export default CustomButton;
