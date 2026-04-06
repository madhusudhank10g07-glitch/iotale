// app/perform.tsx

import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Audio } from 'expo-av'
import { LinearGradient } from 'expo-linear-gradient'

export default function PerformScreen() {
  const router = useRouter()
  const { uri, title, categoryTitle } = useLocalSearchParams<{
    uri: string
    title: string
    categoryTitle: string
  }>()

  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [positionMs, setPositionMs] = useState(0)
  const [durationMs, setDurationMs] = useState(1)

  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    loadAudio()
    startPulse()
    return () => { sound?.unloadAsync() }
  }, [])

  function startPulse() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start()
  }

  async function loadAudio() {
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
      const { sound: s } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        (status) => {
          if (!status.isLoaded) return
          setPositionMs(status.positionMillis)
          setDurationMs(status.durationMillis ?? 1)
          setIsPlaying(status.isPlaying)
        }
      )
      setSound(s)
      setIsPlaying(true)
    } catch (e) {
      console.error('Audio load error:', e)
    }
  }

  async function togglePlay() {
    if (!sound) return
    if (isPlaying) await sound.pauseAsync()
    else await sound.playAsync()
  }

  async function seekBy(ms: number) {
    if (!sound) return
    await sound.setPositionAsync(
      Math.max(0, Math.min(positionMs + ms, durationMs))
    )
  }

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  const progress = durationMs > 0 ? positionMs / durationMs : 0

  return (
    <LinearGradient colors={['#06174A', '#0D2166', '#132D80']} style={styles.root}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => { sound?.unloadAsync(); router.back() }}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerCategory}>{categoryTitle}</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(positionMs)}</Text>
        <Text style={styles.timeText}>{formatTime(durationMs)}</Text>
      </View>

      {/* Now playing card */}
      <View style={styles.nowPlayingContainer}>
        <Animated.View style={[styles.albumArt, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.albumEmoji}>🎵</Text>
        </Animated.View>

        <Text style={styles.nowPlayingLabel}>NOW PLAYING</Text>
        <Text style={styles.nowPlayingTitle}>{title}</Text>
        <Text style={styles.nowPlayingCategory}>{categoryTitle}</Text>
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => seekBy(-10000)} style={styles.ctrlBtn}>
          <Text style={styles.ctrlIcon}>⏪</Text>
          <Text style={styles.ctrlLabel}>10s</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
          <LinearGradient
            colors={['#FF8DC7', '#FF5FA0']}
            style={styles.playGradient}
          >
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => seekBy(10000)} style={styles.ctrlBtn}>
          <Text style={styles.ctrlIcon}>⏩</Text>
          <Text style={styles.ctrlLabel}>10s</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 48 }} />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12,
  },
  backBtn: { width: 60, padding: 8 },
  backText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerCategory: {
    color: 'rgba(255,255,255,0.6)', fontSize: 12,
    fontWeight: '600', letterSpacing: 1, marginBottom: 2,
  },
  headerTitle: {
    color: '#fff', fontSize: 16,
    fontWeight: '800', textAlign: 'center',
  },
  progressTrack: {
    marginHorizontal: 24, height: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3, overflow: 'hidden', marginTop: 8,
  },
  progressFill: { height: '100%', backgroundColor: '#FF8DC7', borderRadius: 3 },
  timeRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginHorizontal: 24, marginTop: 6, marginBottom: 16,
  },
  timeText: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  nowPlayingContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 32,
  },
  albumArt: {
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,141,199,0.15)',
    borderWidth: 3, borderColor: '#FF8DC7',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#FF5FA0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 12,
  },
  albumEmoji: { fontSize: 72 },
  nowPlayingLabel: {
    color: '#FF8DC7', fontSize: 11,
    fontWeight: '800', letterSpacing: 3, marginBottom: 10,
  },
  nowPlayingTitle: {
    color: '#FFFFFF', fontSize: 22,
    fontWeight: '900', textAlign: 'center',
    lineHeight: 28, marginBottom: 8,
  },
  nowPlayingCategory: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14, fontWeight: '600',
  },
  controls: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 32, paddingVertical: 20,
  },
  ctrlBtn: { alignItems: 'center', gap: 4 },
  ctrlIcon: { fontSize: 28 },
  ctrlLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' },
  playBtn: {
    width: 80, height: 80, borderRadius: 40, overflow: 'hidden',
    shadowColor: '#FF5FA0', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6, shadowRadius: 20, elevation: 14,
  },
  playGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 34, color: '#fff' },
})