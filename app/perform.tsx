
// app/perform.tsx

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Audio } from 'expo-av'
import { LinearGradient } from 'expo-linear-gradient'

export default function PerformScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    uri?: string | string[]
    title?: string | string[]
    categoryTitle?: string | string[]
  }>()

  // Decode the local file URI passed from starttales
  const uri = useMemo(() => {
    const v = params.uri
    const raw = Array.isArray(v) ? v[0] : v
    return raw ? decodeURIComponent(raw) : undefined
  }, [params.uri])

  const title = useMemo(() => {
    const v = params.title
    return Array.isArray(v) ? v[0] : (v ?? 'Untitled')
  }, [params.title])

  const categoryTitle = useMemo(() => {
    const v = params.categoryTitle
    return Array.isArray(v) ? v[0] : (v ?? 'Uncategorized')
  }, [params.categoryTitle])

  // ─── Audio state ─────────────────────────────────────────────────────────────
  const soundRef = useRef<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(1)

  useEffect(() => {
    if (!uri) return

    let mounted = true

    async function setup() {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })

        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          (status) => {
            if (!mounted || !status.isLoaded) return
            setPosition(status.positionMillis ?? 0)
            setDuration(status.durationMillis || 1)
            setIsPlaying(status.isPlaying)
          }
        )

        if (!mounted) {
          await sound.unloadAsync()
          return
        }

        soundRef.current = sound
      } catch (err) {
        console.warn('Failed to load audio:', err)
      }
    }

    setup()

    return () => {
      mounted = false
      soundRef.current?.unloadAsync().catch(() => {})
      soundRef.current = null
    }
  }, [uri])

  // ─── Controls ────────────────────────────────────────────────────────────────

  async function handlePlayPause() {
    const sound = soundRef.current
    if (!sound) return
    try {
      isPlaying ? await sound.pauseAsync() : await sound.playAsync()
    } catch (err) {
      console.warn('Playback error:', err)
    }
  }

  async function handleStop() {
    const sound = soundRef.current
    if (!sound) return
    try {
      await sound.stopAsync()
      await sound.setPositionAsync(0)
      setPosition(0)
      setIsPlaying(false)
    } catch (err) {
      console.warn('Stop error:', err)
    }
  }

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0

  function formatTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000)
    const m = Math.floor(totalSec / 60)
    const s = totalSec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <LinearGradient colors={['#06174A', '#132D80']} style={styles.container}>

      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.artContainer}>
        <View style={styles.circle}>
          <Text style={styles.emoji}>📖</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{categoryTitle}</Text>
      </View>

      <View style={styles.transcriptBox}>
        <Text style={styles.transcriptText}>
          &quot;Once upon a time in a land far away...&quot;
        </Text>
      </View>

      {/* Progress bar with timestamps */}
      <View style={styles.progressRow}>
        <Text style={styles.timeLabel}>{formatTime(position)}</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.timeLabel}>{formatTime(duration)}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>

        {/* Stop */}
        <TouchableOpacity
          onPress={handleStop}
          style={[styles.btn, styles.stopBtn]}
          activeOpacity={0.75}
        >
          <Text style={styles.btnIcon}>⏹</Text>
        </TouchableOpacity>

        {/* Play / Pause */}
        <TouchableOpacity
          onPress={handlePlayPause}
          style={[styles.btn, styles.playBtn]}
          activeOpacity={0.8}
        >
          <Text style={[styles.btnIcon, styles.playBtnIcon]}>
            {isPlaying ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>

      </View>

    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  back: { marginTop: 56, alignSelf: 'flex-start' },
  backText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  artContainer: { alignItems: 'center', marginTop: 36 },
  circle: {
    width: 124, height: 124, borderRadius: 62,
    backgroundColor: '#FF8DC7',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#FF8DC7', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55, shadowRadius: 22, elevation: 12,
  },
  emoji: { fontSize: 52 },
  title: {
    color: '#fff', fontSize: 24, fontWeight: '900',
    marginTop: 22, textAlign: 'center', paddingHorizontal: 16,
  },
  sub: { color: 'rgba(255,255,255,0.5)', fontSize: 15, marginTop: 6, textAlign: 'center' },
  transcriptBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  transcriptText: {
    color: '#fff', fontSize: 20, textAlign: 'center',
    fontStyle: 'italic', lineHeight: 32, opacity: 0.85,
  },
  progressRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 12, paddingHorizontal: 4,
  },
  timeLabel: {
    color: 'rgba(255,255,255,0.45)', fontSize: 12,
    fontWeight: '600', minWidth: 36, textAlign: 'center',
  },
  track: {
    flex: 1, height: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 3, overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: '#FF8DC7', borderRadius: 3 },
  controls: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', gap: 24, marginBottom: 52,
  },
  btn: { alignItems: 'center', justifyContent: 'center', borderRadius: 50 },
  stopBtn: {
    width: 60, height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
  },
  playBtn: {
    width: 80, height: 80, backgroundColor: '#FF8DC7',
    shadowColor: '#FF8DC7', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6, shadowRadius: 18, elevation: 10,
  },
  btnIcon: { fontSize: 28, color: '#fff' },
  playBtnIcon: { fontSize: 34 },
})