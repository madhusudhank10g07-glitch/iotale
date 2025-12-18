import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import BackgroundPage from '@/components/props/peppabg';

export default function SplashScreen() {
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const translateX = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <BackgroundPage
          backgroundSource={require('../assets/images/bg/splashload.png')}
    
        > 
    <View style={styles.container}>
      
      {/* Loading Animation */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingTrack}>
          <Animated.View
            style={[
              styles.loadingBar,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </View> 
      </View>
    </View>
     </BackgroundPage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    paddingTop: 100,
  },
  
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 60,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loadingContainer: {
    width: 250,
    alignItems: 'center',
  },
  loadingTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 15,
  },
  loadingBar: {
    width: 100,
    height: '100%',
    borderRadius: 2,
    background: 'linear-gradient(90deg, #4a90e2 0%, #ffffff 50%, #4a90e2 100%)',
    boxShadow: '0 0 10px rgba(74, 144, 226, 0.5)',
  },
  
});