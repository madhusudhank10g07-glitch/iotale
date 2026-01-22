import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import BackgroundPage from '@/components/props/peppabg';

const { width, height } = Dimensions.get('window');

export default function DiyTalesScreen() {
  const router = useRouter();

  const handleBeginRecording = async () => {
    try {
      // Clear audio mode before entering recording screen to avoid hardware conflicts
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
    } catch (e) {
      console.log("Audio reset ignored");
    }
    router.push('/recording');
  };

  const handleViewTales = () => {
    router.push('/tales-list');
  };

  return (
    <BackgroundPage backgroundSource={require('../../assets/images/bg/diyfront.png')}>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollContent} 
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            <Text style={styles.mainTitle}>DIY Tales</Text>
            <Text style={styles.subtitle}>Create Your Own Tales</Text>
            
            <Text style={styles.tipText}>
              Ready to record your fairy tale?{'\n'}
              Tip: Use an expressive voice and introduce pauses for dramatic effect.
            </Text>

            <TouchableOpacity 
              style={styles.recordButton}
              onPress={handleBeginRecording}
              activeOpacity={0.8}
            >
              <Ionicons name="mic" size={width * 0.06} color="#FFFFFF" />
              <Text style={styles.recordButtonText}>Begin Recording</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.viewTalesButton}
              onPress={handleViewTales}
              activeOpacity={0.8}
            >
              <Ionicons name="list" size={width * 0.05} color="#FFFFFF" />
              <Text style={styles.viewTalesButtonText}>View My Tales</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </BackgroundPage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flex: 1 },
  scrollContentContainer: { paddingBottom: 40 },
  mainContent: {
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
    marginTop: height * 0.15,
  },
  mainTitle: {
    fontSize: width * 0.1,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.06,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  tipText: {
    fontSize: width * 0.04,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  recordButton: {
    backgroundColor: '#22c55e',
    width: '85%',
    paddingVertical: 18,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  viewTalesButton: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '70%',
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  viewTalesButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
});