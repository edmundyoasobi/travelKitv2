import React, { useEffect, useRef } from 'react';
import { Image } from 'react-native';
import { View, Animated, StyleSheet } from 'react-native';

const ImageSkeleton = () => {
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

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#adadad', '#ffffff'],
  });

  return (

        <Animated.View  style={[styles.skeletonItem, { backgroundColor}]} />

  );
};

const styles = StyleSheet.create({

  skeletonItem: {
    height: 200,
    backgroundColor: "#adadad",
    borderRadius: 10,
  },
});

export default ImageSkeleton;
