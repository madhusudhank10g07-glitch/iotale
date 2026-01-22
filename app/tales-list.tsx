import React, { useState, useCallback } from 'react';
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
  Dimensions,
  Platform,
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
import BackgroundPage from '@/components/props/peppabg';

const { width, height } = Dimensions.get('window');

const DIYListPage = () => {
  const router = useRouter();
  const [tales, setTales] = useState<Tale[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadTales();
      return () => {
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

  const handleBack = () => router.back();
  const handleRecordNew = () => router.push('/recording');

  const handlePlayTale = async (tale: Tale) => {
    try {
      if (playingId === tale.id && sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setPlayingId(null);
        return;
      }

      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: tale.audio_url },
        { shouldPlay: true }
      );

      setSound(newSound);
      setPlayingId(tale.id);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (error) {
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
              if (playingId === tale.id && sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
                setSound(null);
                setPlayingId(null);
              }
              const success = await deleteTale(tale.id, tale.file_path);
              if (success) {
                setTales(tales.filter(t => t.id !== tale.id));
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: '#1a1a1a' }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading your tales...</Text>
      </View>
    );
  }

  return (
    <BackgroundPage backgroundSource={require('../assets/images/bg/diybg.png')}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />
          }
        >
          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={width * 0.06} color="#FFFFFF" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
                My DIY Tales
              </Text>
              <TouchableOpacity style={styles.recordButton} onPress={handleRecordNew}>
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.recordButtonText}>New</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tales List */}
          {tales.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="mic-off-outline" size={width * 0.2} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyText}>No tales yet</Text>
              <Text style={styles.emptySubtext}>Tap "New" to create your first tale!</Text>
            </View>
          ) : (
            <View style={styles.talesList}>
              {tales.map((tale) => (
                <View key={tale.id} style={styles.taleCard}>
                  <View style={styles.taleInfo}>
                    <Text style={styles.taleTitle} numberOfLines={1}>{tale.title}</Text>
                    <Text style={styles.taleDetails}>
                      {formatDuration(tale.duration)} • {formatDate(tale.created_at)}
                    </Text>
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.playButton}
                      onPress={() => handlePlayTale(tale)}
                    >
                      <Ionicons 
                        name={playingId === tale.id ? 'stop' : 'play'} 
                        size={width * 0.06} 
                        color="#FFFFFF" 
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteTale(tale)}
                    >
                      <Ionicons name="trash-outline" size={width * 0.05} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </BackgroundPage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    // Adjusts top padding based on device notches/status bars
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 40,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: width * 0.05,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 4,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: width * 0.08, // Dynamic font size based on screen width
    fontWeight: '800',
    flex: 1,
  },
  recordButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
    marginTop: height * 0.1,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: width * 0.04,
    textAlign: 'center',
    marginTop: 10,
  },
  talesList: {
    paddingHorizontal: width * 0.05,
    gap: 12,
  },
  taleCard: {
    backgroundColor: "#0d5a9d",
    borderRadius: 16,
    padding: width * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taleInfo: {
    flex: 1,
    paddingRight: 10,
  },
  taleTitle: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taleDetails: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: width * 0.032,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  playButton: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
    backgroundColor: '#ec4899',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DIYListPage;