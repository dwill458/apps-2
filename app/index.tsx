/**
 * App Entry Point
 * Routes to onboarding or main app based on user state
 */

import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { onboardingStorage } from '../src/utils/storage';
import { Colors } from '../src/constants';

export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const isOnboarded = await onboardingStorage.isOnboarded();

      // Small delay for smooth transition
      setTimeout(() => {
        if (isOnboarded) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding-new');
        }
      }, 500);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Default to onboarding if there's an error
      router.replace('/onboarding-new');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary.sage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
