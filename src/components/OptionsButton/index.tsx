import { Animated, TouchableOpacity, useAnimatedValue } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { type SvgProps } from 'react-native-svg';

interface OptionsButtonPrps {
  callback: () => void;
  icon: React.ReactElement<SvgProps>;
  toValue: number;
  showOptions: boolean;
}

export const OptionsButtons = ({ icon, callback, toValue, showOptions }: OptionsButtonPrps) => {
  const translateY = useAnimatedValue(useRef(0).current);
  const opacity = useAnimatedValue(useRef(0).current);
  const [visibleButton, setVisibleButton] = useState(false);
  const ButtonAnimated = Animated.createAnimatedComponent(TouchableOpacity);

  const startAnimation = Animated.parallel([
    Animated.timing(opacity, {
      toValue: !showOptions ? 0 : 1,
      duration: 600,
      useNativeDriver: false,
    }),
    Animated.timing(translateY, {
      toValue,
      duration: 700,
      useNativeDriver: false,
    }),
  ]);

  useEffect(() => {
    showOptions && setVisibleButton(true);
    startAnimation.start(() => {
      showOptions ? setVisibleButton(true) : setVisibleButton(false);
    });
  }, [showOptions]);

  return (
    visibleButton && (
      <ButtonAnimated
        style={{ transform: [{ translateY }], opacity }}
        onPress={() => {
          callback();
        }}>
        {icon}
      </ButtonAnimated>
    )
  );
};
