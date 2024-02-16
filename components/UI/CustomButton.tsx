import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../colors';
import { lightenHexColor } from '../../service/tools';
import { CustomButtonProps } from '../../types';

const CustomButton = ({
  title,
  onPress,
  iconName,
  color = colors.primary,
  disabled = false,
  style,
}: CustomButtonProps) => {
  const lighterColor = lightenHexColor(color, 15);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.buttonContainer, style]}
    >
      <LinearGradient
        colors={
          disabled ? [colors.disabled, colors.disabled1] : [color, lighterColor]
        }
        style={styles.buttonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.buttonContent}>
          <Ionicons
            name={iconName}
            size={25}
            color={disabled ? colors.disabledText : colors.white}
          />
          <Text style={[styles.text, disabled && styles.disabledText]}>
            {title}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    marginVertical: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    minHeight: 48,
  },
  buttonGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 48, // Or any fixed height you prefer
    paddingHorizontal: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  text: {
    color: colors.white,
    marginLeft: 5,
  },
  disabledText: {
    color: colors.disabledText,
    marginLeft: 5,
  },
});

export default CustomButton;
