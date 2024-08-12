import React, { useEffect, useRef } from 'react';
import { Image } from 'react-native';
import { View, Animated, StyleSheet } from 'react-native';

const SkeletonTemplate = (props) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [animatedValue]);

  const customStyle = {height: props.height, width : props.width};

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#adadad', '#ffffff'],
  });

  return (

        <Animated.View  style={[styles.skeletonItem, { backgroundColor}, customStyle]} />

  );
};

const styles = StyleSheet.create({

  skeletonItem: {
    backgroundColor: "#adadad",
    borderRadius: 10,
  },
});

export default SkeletonTemplate;
