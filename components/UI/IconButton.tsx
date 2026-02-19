import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../colors';
import spacing from '../../spacing';
import { CustomButtonProps } from '../../types';

const IconButton = ({
  iconName,
  onPress,
  color,
  style,
  size = 22,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Ionicons
        name={iconName as any}
        size={size}
        color={color || colors.textSecondary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xs,
    paddingRight: spacing.sm,
  },
});

export default IconButton;
