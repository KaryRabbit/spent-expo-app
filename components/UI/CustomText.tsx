import React from 'react';
import { Text } from 'react-native';

const CustomText = ({ children, style, ...props }) => {
  return (
    <Text style={style} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
