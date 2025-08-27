import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

export const PulsingDots = () => {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((index) => (
        <MotiView
          key={index}
          from={{ opacity: 0.2, scale: 1 }}
          animate={{ opacity: 1, scale: 1.5 }}
          transition={{
            type: 'timing',
            duration: 400,
            delay: index * 200,
            loop: true,
            repeatReverse: true,
          }}
          style={styles.dot}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 3,
    backgroundColor: '#FE2C55',
    marginHorizontal: 3,
  },
});
