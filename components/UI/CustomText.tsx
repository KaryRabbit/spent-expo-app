import React from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import colors from '../../colors';
import { textStyles } from '../../typography';

type CustomTextProps = TextProps & {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

const CustomText = ({ children, style, ...props }: CustomTextProps) => {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.textPrimary,
    fontSize: textStyles.bodyMedium.fontSize,
    fontWeight: textStyles.bodyMedium.fontWeight,
  },
});

export default CustomText;
