import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';

const ButtonComponent = ({...rest}: TouchableOpacityProps) => {
  return <TouchableOpacity {...rest} />;
};

export default ButtonComponent;
