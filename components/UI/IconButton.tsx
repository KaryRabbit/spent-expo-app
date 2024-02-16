import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { CustomButtonProps } from '../../types';

const IconButton = ({
  iconName,
  onPress,
  color,
  style,
  size = 25,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Ionicons name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
};

export default IconButton;
