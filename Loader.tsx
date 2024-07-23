import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const Ball = ({ animationValue }: { animationValue: Animated.Value }) => {
  const scale = animationValue.interpolate({
    inputRange: [0, 10, 11, 39, 40, 41, 69, 70, 80, 90, 100],
    outputRange: [1, 1.3, 0.7, 1, 1, 1, 1, 1.5, 0.8, 1.1, 1],
    extrapolate: 'clamp',
  });

  const translateY = animationValue.interpolate({
    inputRange: [0, 39, 69],
    outputRange: [0, -75, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.ball,
        {
          transform: [
            { translateY },
            { scaleX: scale },
            { scaleY: scale },
          ],
        },
      ]}
    />
  );
};

const Loader = () => {
  const animationValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animationValue, {
        toValue: 100,
        duration: 1500,
        useNativeDriver: true,
      }),
    ).start();
  }, [animationValue]);

  return (
    <View style={styles.loader}>
      <View style={styles.group}>
        <Ball animationValue={animationValue} />
        <Ball animationValue={animationValue} />
        <Ball animationValue={animationValue} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    flex: 1,
    backgroundColor: 'black', 
  },
  group: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ball: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: 'white', 
  },
});

export default Loader;
