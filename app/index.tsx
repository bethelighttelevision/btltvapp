import { useEffect, useRef } from 'react';
import { View, Animated, Easing, Image } from 'react-native';
import { router } from 'expo-router';

export default function IndexScreen() {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      const hasSeenOnboarding = false;
      if (!hasSeenOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)/home');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0F', alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
        <Image
          source={require('../assets/icon.png')}
          style={{ width: 180, height: 180 }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}
