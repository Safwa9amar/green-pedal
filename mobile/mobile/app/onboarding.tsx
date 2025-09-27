// filepath: /home/astro/green-perdal/mobile/app/onboarding.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import { useAppLaunchStore } from '../src/store/useAppLaunchStore';
import { useTheme } from '@react-navigation/native';
import type { GreenRideTheme } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
  const { colors } = useTheme() as GreenRideTheme;

  const background = colors.background;
  const text = colors.text;
  const primary = colors.primary;
  const secondary = colors.secondary;
  const accent = colors.accent || colors.logoGreen;
  const card = colors.card;
  const border = colors.border;
  const navigation = useNavigation();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const { setNotFirstLaunch } = useAppLaunchStore();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const steps = useMemo(
    () => [
      {
        key: 'locate',
        title: 'Locate a Bike',
        description: 'Find nearby bikes on the map and pick the closest one to you.',
        image: require('../assets/images/Locate.png'),
      },
      {
        key: 'unlock',
        title: 'Unlock Instantly',
        description: 'Scan the QR code to unlock the bike and get ready to ride.',
        image: require('../assets/images/Unlock.png'),
      },
      {
        key: 'ride',
        title: 'Ride & Enjoy',
        description: 'Cruise to your destination and return the bike at any station.',
        image: require('../assets/images/Ride.png'),
      },
    ],
    []
  );

  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await setNotFirstLaunch();
      router.replace('/(auth)/login');
    } else {
      setIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSkip = async () => {
    await setNotFirstLaunch();
    router.replace('/(auth)/login');
  };

  const current = steps[index];

  return (
    <LinearGradient
      colors={["#EEE", "white"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { backgroundColor: background }]}
    >
      <View style={styles.imageWrap}>
        <Image source={current.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={{ flex: 1, width: '100%', paddingHorizontal: 24, alignItems: 'center' }}>
        <View style={styles.textWrap}>
          <Text style={[styles.title, { color: text }]}>{current.title}</Text>
          <Text style={[styles.description, { color: text }]}>{current.description}</Text>
        </View>

        <View style={styles.dotsWrap}>
          {steps.map((_, i) => (
            <View key={i} style={[styles.dot, i === index ? [styles.dotActive, { backgroundColor: accent }] : [styles.dotInactive, { backgroundColor: border }]]} />
          ))}
        </View>

        <View style={styles.footerWrap}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={[styles.footerText, { color: accent }]}>Skip</Text>
          </TouchableOpacity>
          <View style={styles.footerDots}>
            {steps.map((_, i) => (
              <View key={`f-${i}`} style={[styles.dot, i === index ? [styles.dotActive, { backgroundColor: accent }] : [styles.dotInactive, { backgroundColor: border }]]} />
            ))}
          </View>
          <TouchableOpacity onPress={handleNext}>
            <Text style={[styles.footerText, { color: accent }]}>{isLast ? 'Next' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 32,
    alignItems: 'center',
  },
  imageWrap: {
    width: '100%',
    height: height * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textWrap: {
    flex: 2,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsWrap: {
    display: 'none',
  },
  footerWrap: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontWeight: '700',
    fontSize: 18,
  },
  footerDots: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotInactive: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    width: 22,
    borderRadius: 5,
  },
  buttonsWrap: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  navButtonTextDisabled: {
    color: 'rgba(255,255,255,0.7)',
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  ctaButtonText: {
    color: '#1C1742',
    fontWeight: '700',
    fontSize: 16,
  },
});