// screens/DIYListPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import {
  fetchUserTales,
  deleteTale,
  formatDuration,
  formatDate,
  Tale,
} from '../lib/talesService';

const DIYListPage = () => {
  const router = useRouter();
  const [tales, setTales] = useState<Tale[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Load tales on screen focus
  useFocusEffect(
    useCallback(() => {
      loadTales();
      return () => {
        // Cleanup sound on unmount
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, [])
  );

  const loadTales = async () => {
    try {
      setLoading(true);
      const data = await fetchUserTales();
      setTales(data);
    } catch (error) {
      console.error('Error loading tales:', error);
      Alert.alert('Error', 'Failed to load tales');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTales();
    setRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleRecordNew = () => {
    router.push('/recording');
  };

  const handlePlayTale = async (tale: Tale) => {
    try {
      // If already playing this tale, stop it
      if (playingId === tale.id && sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setPlayingId(null);
        return;
      }

      // Stop any currently playing sound
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      // Load and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: tale.audio_url },
        { shouldPlay: true }
      );

      setSound(newSound);
      setPlayingId(tale.id);

      // Handle playback completion
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (error) {
      console.error('Error playing tale:', error);
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const handleDeleteTale = (tale: Tale) => {
    Alert.alert(
      'Delete Tale',
      `Are you sure you want to delete "${tale.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Stop playback if this tale is playing
              if (playingId === tale.id && sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
                setSound(null);
                setPlayingId(null);
              }

              const success = await deleteTale(tale.id, tale.file_path);
              
              if (success) {
                setTales(tales.filter(t => t.id !== tale.id));
                Alert.alert('Success', 'Tale deleted successfully');
              } else {
                Alert.alert('Error', 'Failed to delete tale');
              }
            } catch (error) {
              console.error('Error deleting tale:', error);
              Alert.alert('Error', 'An unexpected error occurred');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading your tales...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.titleRow}>
            <Text style={styles.title}>My DIY Tales</Text>
            <TouchableOpacity style={styles.recordButton} onPress={handleRecordNew}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.recordButtonText}>Record New</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tales List */}
        {tales.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="mic-off-outline" size={64} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyText}>No tales yet</Text>
            <Text style={styles.emptySubtext}>
              Tap "Record New" to create your first tale!
            </Text>
          </View>
        ) : (
          <View style={styles.talesList}>
            {tales.map((tale) => (
              <View key={tale.id} style={styles.taleCard}>
                <View style={styles.taleInfo}>
                  <Text style={styles.taleTitle} numberOfLines={1}>
                    {tale.title}
                  </Text>
                  <Text style={styles.taleDetails}>
                    {formatDuration(tale.duration)} | {formatDate(tale.created_at)}
                  </Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => handlePlayTale(tale)}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={playingId === tale.id ? 'stop' : 'play'} 
                      size={24} 
                      color="#FFFFFF" 
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTale(tale)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B5CF6',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    flex: 1,
  },
  recordButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 100,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  talesList: {
    paddingHorizontal: 20,
    paddingTop: 15,
    gap: 14,
  },
  taleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 88,
  },
  taleInfo: {
    flex: 1,
    paddingRight: 12,
  },
  taleTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taleDetails: {
    color: '#FFFFFF',
    fontSize: 13,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ec4899',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DIYListPage;