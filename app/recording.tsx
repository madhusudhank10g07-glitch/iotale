// screens/DIYRecordingPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import SaveRecordingModal from '@/components/pages/SaveRecordingModal';
import { uploadAudioFile, saveTale } from '../lib/talesService';
import { supabase } from '../lib/supabase';

type RecordingState = 'countdown' | 'recording' | 'paused' | 'stopped';

const DIYRecordingPage = () => {
  const router = useRouter();
  const [state, setState] = useState<RecordingState>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string>('');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Pulse animation
  useEffect(() => {
    if (state === 'recording') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [state]);

  // Countdown logic
  useEffect(() => {
    if (state === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (state === 'countdown' && countdown === 0) {
      startRecording();
    }
  }, [state, countdown]);

  // Recording timer
  useEffect(() => {
    if (state === 'recording') {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state]);

  // Request audio permissions and start recording
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to record audio.');
        router.back();
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setState('recording');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
      router.back();
    }
  };

  // Pause/Resume recording
  const togglePause = async () => {
    if (!recording) return;

    try {
      if (state === 'recording') {
        await recording.pauseAsync();
        setState('paused');
      } else if (state === 'paused') {
        await recording.startAsync();
        setState('recording');
      }
    } catch (error) {
      console.error('Error toggling pause:', error);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        setRecordingUri(uri);
        setState('stopped');
        setShowSaveModal(true);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  // Restart recording
  const restartRecording = () => {
    Alert.alert(
      'Restart Recording',
      'Are you sure you want to restart? This will discard the current recording.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restart',
          style: 'destructive',
          onPress: async () => {
            if (recording) {
              try {
                await recording.stopAndUnloadAsync();
              } catch (error) {
                console.error('Error stopping recording:', error);
              }
            }
            setRecording(null);
            setRecordingTime(0);
            setCountdown(3);
            setState('countdown');
          },
        },
      ]
    );
  };

  // Change playback speed (for future playback feature)
  const cyclePlaybackRate = () => {
    const rates = [0.5, 0.75, 1.0, 1.25, 1.5];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
    Alert.alert('Playback Speed', `Speed set to ${rates[nextIndex]}x`);
  };

  // Save recording
  const handleSave = async (title: string) => {
    try {
      if (!recordingUri) {
        Alert.alert('Error', 'No recording found');
        return;
      }

      // Show loading
      Alert.alert('Saving', 'Please wait while we save your recording...');

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      // Upload audio file
      const uploadResult = await uploadAudioFile(recordingUri, user.id);
      
      if (!uploadResult) {
        Alert.alert('Error', 'Failed to upload recording');
        return;
      }

      // Save to database
      const tale = await saveTale(
        title,
        recordingTime,
        uploadResult.publicUrl,
        uploadResult.filePath
      );

      if (tale) {
        Alert.alert('Success', 'Your tale has been saved!', [
          {
            text: 'OK',
            onPress: () => {
              setShowSaveModal(false);
              router.push('/tales-list');
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to save tale to database');
      }
    } catch (error) {
      console.error('Error saving tale:', error);
      Alert.alert('Error', 'An unexpected error occurred while saving');
    }
  };

  // Delete recording
  const handleDelete = () => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setShowSaveModal(false);
            router.back();
          },
        },
      ]
    );
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Countdown or Recording Indicator */}
      <View style={styles.recordingContainer}>
        {state === 'countdown' ? (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>{countdown}</Text>
            <Text style={styles.countdownLabel}>Get Ready...</Text>
          </View>
        ) : (
          <>
            {/* Pulse circles */}
            <Animated.View
              style={[
                styles.pulseCircle,
                styles.pulseOuter,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <Animated.View
              style={[
                styles.pulseCircle,
                styles.pulseMiddle,
                {
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [1, 1.2],
                        outputRange: [1, 1.1],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.pulseCircle,
                styles.pulseInner,
                {
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [1, 1.2],
                        outputRange: [1, 1.05],
                      }),
                    },
                  ],
                },
              ]}
            />

            {/* Microphone Icon */}
            <View style={styles.micContainer}>
              <Ionicons name="mic" size={48} color="#FFFFFF" />
            </View>
          </>
        )}
      </View>

      {/* Recording Status */}
      {state !== 'countdown' && (
        <>
          <Text style={styles.recordingText}>
            {state === 'recording' ? 'Recording Your Tale...' : 
             state === 'paused' ? 'Recording Paused' : 
             'Recording Stopped'}
          </Text>
          <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
        </>
      )}

      {/* Control Buttons */}
      {state !== 'countdown' && (
        <View style={styles.controlsContainer}>
          {/* Pause/Play Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={togglePause}
            disabled={state === 'stopped'}
          >
            <Ionicons
              name={state === 'paused' ? 'play' : 'pause'}
              size={32}
              color={state === 'stopped' ? '#666' : '#FFFFFF'}
            />
          </TouchableOpacity>

          {/* Stop Button */}
          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton]}
            onPress={stopRecording}
            disabled={state === 'stopped'}
          >
            <Ionicons 
              name="stop" 
              size={32} 
              color={state === 'stopped' ? '#666' : '#FFFFFF'} 
            />
          </TouchableOpacity>

          {/* Restart Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={restartRecording}
            disabled={state === 'stopped'}
          >
            <Ionicons 
              name="reload" 
              size={32} 
              color={state === 'stopped' ? '#666' : '#FFFFFF'} 
            />
          </TouchableOpacity>

          {/* Speed Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={cyclePlaybackRate}
          >
            <Text style={styles.speedText}>{playbackRate}x</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Save Modal */}
      <SaveRecordingModal
        visible={showSaveModal}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={() => setShowSaveModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  recordingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    marginBottom: 40,
    height: 300,
  },
  countdownContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  countdownLabel: {
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 20,
    fontWeight: '600',
  },
  pulseCircle: {
    position: 'absolute',
    borderRadius: 1000,
  },
  pulseOuter: {
    width: 280,
    height: 280,
    backgroundColor: 'rgba(139, 117, 165, 0.3)',
  },
  pulseMiddle: {
    width: 220,
    height: 220,
    backgroundColor: 'rgba(186, 141, 186, 0.4)',
  },
  pulseInner: {
    width: 160,
    height: 160,
    backgroundColor: 'rgba(255, 182, 193, 0.5)',
  },
  micContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF69B4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 80,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
  },
  speedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DIYRecordingPage;