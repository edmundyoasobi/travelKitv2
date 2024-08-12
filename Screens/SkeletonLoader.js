import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const SkeletonLoader = () => {
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
    <View style={styles.skeletonContainer}>
        <Animated.View  style={[styles.skeletonItem, { backgroundColor ,width : 150}]} />
      {[...Array(6)].map((_, index) => (
        <Animated.View key={index} style={[styles.skeletonItem, { backgroundColor }]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    
  },
  skeletonItem: {
    width: 90,
    height: 35,
    backgroundColor: "#adadad",
    borderRadius: 10,
    margin: 5,
    marginHorizontal : 10,
  },
});

export default SkeletonLoader;
