// components/props/peppabg.tsx

import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ImageSourcePropType } from 'react-native';

interface BackgroundPageProps {
  backgroundSource: ImageSourcePropType;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  titleColor?: string;
  subtitleColor?: string;
}

export default function BackgroundPage({
  backgroundSource,
  title,
  subtitle,
  children,
  titleColor = '#ffffff',
  subtitleColor = '#ffffff',
}: BackgroundPageProps) {
  return (
    <ImageBackground
      source={backgroundSource}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>
        {title && (
          <Text style={[styles.title, { color: titleColor }]}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text style={[styles.subtitle, { color: subtitleColor }]}>
            {subtitle}
          </Text>
        )}
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
