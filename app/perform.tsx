
// // app/perform.tsx

// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
// import { useLocalSearchParams, useRouter } from 'expo-router'
// import { useEffect, useMemo, useRef, useState } from 'react'
// import { Audio } from 'expo-av'
// import { LinearGradient } from 'expo-linear-gradient'
// import BackgroundPage from '@/components/props/peppabg'

// export default function PerformScreen() {
//   const router = useRouter()
//   const params = useLocalSearchParams<{
//     uri?: string | string[]
//     title?: string | string[]
//     categoryTitle?: string | string[]
//   }>()

//   // Decode the local file URI passed from starttales
//   const uri = useMemo(() => {
//     const v = params.uri
//     const raw = Array.isArray(v) ? v[0] : v
//     return raw ? decodeURIComponent(raw) : undefined
//   }, [params.uri])

//   const title = useMemo(() => {
//     const v = params.title
//     return Array.isArray(v) ? v[0] : (v ?? 'Untitled')
//   }, [params.title])

//   const categoryTitle = useMemo(() => {
//     const v = params.categoryTitle
//     return Array.isArray(v) ? v[0] : (v ?? 'Uncategorized')
//   }, [params.categoryTitle])

//   // ─── Audio state ─────────────────────────────────────────────────────────────
//   const soundRef = useRef<Audio.Sound | null>(null)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [position, setPosition] = useState(0)
//   const [duration, setDuration] = useState(1)

//   useEffect(() => {
//     if (!uri) return

//     let mounted = true

//     async function setup() {
//       try {
//         await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })

//         const { sound } = await Audio.Sound.createAsync(
//           { uri },
//           { shouldPlay: true },
//           (status) => {
//             if (!mounted || !status.isLoaded) return
//             setPosition(status.positionMillis ?? 0)
//             setDuration(status.durationMillis || 1)
//             setIsPlaying(status.isPlaying)
//           }
//         )

//         if (!mounted) {
//           await sound.unloadAsync()
//           return
//         }

//         soundRef.current = sound
//       } catch (err) {
//         console.warn('Failed to load audio:', err)
//       }
//     }

//     setup()

//     return () => {
//       mounted = false
//       soundRef.current?.unloadAsync().catch(() => {})
//       soundRef.current = null
//     }
//   }, [uri])

//   // ─── Controls ────────────────────────────────────────────────────────────────

//   async function handlePlayPause() {
//     const sound = soundRef.current
//     if (!sound) return
//     try {
//       isPlaying ? await sound.pauseAsync() : await sound.playAsync()
//     } catch (err) {
//       console.warn('Playback error:', err)
//     }
//   }

//   async function handleStop() {
//     const sound = soundRef.current
//     if (!sound) return
//     try {
//       await sound.stopAsync()
//       await sound.setPositionAsync(0)
//       setPosition(0)
//       setIsPlaying(false)
//     } catch (err) {
//       console.warn('Stop error:', err)
//     }
//   }

//   const progress = duration > 0 ? Math.min(position / duration, 1) : 0

//   function formatTime(ms: number): string {
//     const totalSec = Math.floor(ms / 1000)
//     const m = Math.floor(totalSec / 60)
//     const s = totalSec % 60
//     return `${m}:${s.toString().padStart(2, '0')}`
//   }

//   // ─── Render ──────────────────────────────────────────────────────────────────

//   return (
//     <BackgroundPage
//         backgroundSource={require("../assets/images/bg/diynumber.png")}
//       > 

//       <TouchableOpacity onPress={() => router.back()} style={styles.back}>
//         <Text style={styles.backText}>← Back</Text>
//       </TouchableOpacity>

//       <View style={styles.artContainer}>
//         <View style={styles.circle}>
//           <Text style={styles.emoji}>📖</Text>
//         </View>
//         <Text style={styles.title}>{title}</Text>
//         <Text style={styles.sub}>{categoryTitle}</Text>
//       </View>

//       <View style={styles.transcriptBox}>
//         <Text style={styles.transcriptText}>
//           &quot;Once upon a time in a land far away...&quot;
//         </Text>
//       </View>

//       {/* Progress bar with timestamps */}
//       <View style={styles.progressRow}>
//         <Text style={styles.timeLabel}>{formatTime(position)}</Text>
//         <View style={styles.track}>
//           <View style={[styles.fill, { width: `${progress * 100}%` }]} />
//         </View>
//         <Text style={styles.timeLabel}>{formatTime(duration)}</Text>
//       </View>

//       {/* Controls */}
//       <View style={styles.controls}>

//         {/* Stop */}
//         <TouchableOpacity
//           onPress={handleStop}
//           style={[styles.btn, styles.stopBtn]}
//           activeOpacity={0.75}
//         >
//           <Text style={styles.btnIcon}>⏹</Text>
//         </TouchableOpacity>

//         {/* Play / Pause */}
//         <TouchableOpacity
//           onPress={handlePlayPause}
//           style={[styles.btn, styles.playBtn]}
//           activeOpacity={0.8}
//         >
//           <Text style={[styles.btnIcon, styles.playBtnIcon]}>
//             {isPlaying ? '⏸' : '▶'}
//           </Text>
//         </TouchableOpacity>

//       </View>

    
//     </BackgroundPage>
//   )
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingHorizontal: 20 },
//   back: { marginTop: 56, alignSelf: 'flex-start' },
//   backText: { color: '#fff', fontWeight: '700', fontSize: 16 },
//   artContainer: { alignItems: 'center', marginTop: 36 },
//   circle: {
//     width: 124, height: 124, borderRadius: 62,
//     backgroundColor: '#FF8DC7',
//     justifyContent: 'center', alignItems: 'center',
//     shadowColor: '#FF8DC7', shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.55, shadowRadius: 22, elevation: 12,
//   },
//   emoji: { fontSize: 52 },
//   title: {
//     color: '#fff', fontSize: 24, fontWeight: '900',
//     marginTop: 22, textAlign: 'center', paddingHorizontal: 16,
//   },
//   sub: { color: 'rgba(255,255,255,0.5)', fontSize: 15, marginTop: 6, textAlign: 'center' },
//   transcriptBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
//   transcriptText: {
//     color: '#fff', fontSize: 20, textAlign: 'center',
//     fontStyle: 'italic', lineHeight: 32, opacity: 0.85,
//   },
//   progressRow: {
//     flexDirection: 'row', alignItems: 'center',
//     gap: 10, marginBottom: 12, paddingHorizontal: 4,
//   },
//   timeLabel: {
//     color: 'rgba(255,255,255,0.45)', fontSize: 12,
//     fontWeight: '600', minWidth: 36, textAlign: 'center',
//   },
//   track: {
//     flex: 1, height: 6,
//     backgroundColor: 'rgba(255,255,255,0.18)',
//     borderRadius: 3, overflow: 'hidden',
//   },
//   fill: { height: '100%', backgroundColor: '#FF8DC7', borderRadius: 3 },
//   controls: {
//     flexDirection: 'row', justifyContent: 'center',
//     alignItems: 'center', gap: 24, marginBottom: 52,
//   },
//   btn: { alignItems: 'center', justifyContent: 'center', borderRadius: 50 },
//   stopBtn: {
//     width: 60, height: 60,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
//   },
//   playBtn: {
//     width: 80, height: 80, backgroundColor: '#FF8DC7',
//     shadowColor: '#FF8DC7', shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.6, shadowRadius: 18, elevation: 10,
//   },
//   btnIcon: { fontSize: 28, color: '#fff' },
//   playBtnIcon: { fontSize: 34 },
// })



import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, PanResponder, Animated,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Audio } from 'expo-av'
import BackgroundPage from '@/components/props/peppabg'
import { transcripts } from '@/transcripts'

export default function PerformScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    uri?: string | string[]
    title?: string | string[]
    categoryTitle?: string | string[]
    fileName?: string | string[]
  }>()

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

  const transcriptKey = useMemo(() => {
    const v = params.fileName
    const raw = Array.isArray(v) ? v[0] : v
    if (!raw) return undefined
    return raw.replace(/\.[^.]+$/, '')
  }, [params.fileName])

  // ─── Transcript ──────────────────────────────────────────────────────────────

  const words = useMemo(() => {
    if (!transcriptKey) return []
    return transcripts[transcriptKey] ?? []
  }, [transcriptKey])

  const CHUNK = 8
  const segments = useMemo(() => {
    const result: (typeof words)[] = []
    for (let i = 0; i < words.length; i += CHUNK) {
      result.push(words.slice(i, i + CHUNK))
    }
    return result
  }, [words])

  // ─── Audio state ─────────────────────────────────────────────────────────────

  const soundRef = useRef<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(1)
  const durationRef = useRef(1)

  useEffect(() => {
    durationRef.current = duration
  }, [duration])

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
        if (!mounted) { await sound.unloadAsync(); return }
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

  // ─── Draggable progress bar ──────────────────────────────────────────────────

  const trackWidth = useRef(0)
  const isDragging = useRef(false)
  const [dragProgress, setDragProgress] = useState<number | null>(null)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (e) => {
        isDragging.current = true
        const x = e.nativeEvent.locationX
        const ratio = Math.min(Math.max(x / trackWidth.current, 0), 1)
        setDragProgress(ratio)
      },

      onPanResponderMove: (e) => {
        const x = e.nativeEvent.locationX
        const ratio = Math.min(Math.max(x / trackWidth.current, 0), 1)
        setDragProgress(ratio)
      },

      onPanResponderRelease: async (e) => {
        const x = e.nativeEvent.locationX
        const ratio = Math.min(Math.max(x / trackWidth.current, 0), 1)
        const seekMs = ratio * durationRef.current
        setDragProgress(null)
        isDragging.current = false
        try {
          await soundRef.current?.setPositionAsync(seekMs)
          setPosition(seekMs)
        } catch (err) {
          console.warn('Seek error:', err)
        }
      },

      onPanResponderTerminate: () => {
        setDragProgress(null)
        isDragging.current = false
      },
    })
  ).current

  const displayProgress = dragProgress !== null
    ? dragProgress
    : (duration > 0 ? Math.min(position / duration, 1) : 0)

  // ─── Find current word ───────────────────────────────────────────────────────

  const currentWordIndex = useMemo(() => {
    if (!words.length) return -1
    let idx = -1
    for (let i = 0; i < words.length; i++) {
      if (words[i].start <= position) idx = i
      else break
    }
    return idx
  }, [words, position])

  const currentSegment = Math.max(0, Math.floor(currentWordIndex / CHUNK))

  // ─── Transcript scroll — user can scroll manually, resumes auto after 2s ─────

  const scrollRef = useRef<ScrollView>(null)
  const segmentYRef = useRef<number[]>([])
  const lastScrolledSegment = useRef(-1)
  const userScrolling = useRef(false)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Word tap → seek audio to that word's timestamp
  function handleWordPress(wordIndex: number) {
    const word = words[wordIndex]
    if (!word) return
    soundRef.current?.setPositionAsync(word.start).catch(() => {})
    setPosition(word.start)
  }

  // Auto-scroll — only fires when user is not manually scrolling
  useEffect(() => {
    if (userScrolling.current) return
    if (currentSegment === lastScrolledSegment.current) return
    const y = segmentYRef.current[currentSegment]
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 60), animated: true })
      lastScrolledSegment.current = currentSegment
    }
  }, [currentSegment])

  function handleScrollBegin() {
    userScrolling.current = true
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
  }

  function handleScrollEnd() {
    // Resume auto-scroll 2 seconds after user lifts finger
    resumeTimer.current = setTimeout(() => {
      userScrolling.current = false
      // Immediately snap back to current position
      const y = segmentYRef.current[currentSegment]
      if (y !== undefined) {
        scrollRef.current?.scrollTo({ y: Math.max(0, y - 60), animated: true })
        lastScrolledSegment.current = currentSegment
      }
    }, 2000)
  }

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
      scrollRef.current?.scrollTo({ y: 0, animated: true })
      lastScrolledSegment.current = -1
      userScrolling.current = false
    } catch (err) {
      console.warn('Stop error:', err)
    }
  }

  function formatTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000)
    const m = Math.floor(totalSec / 60)
    const s = totalSec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <BackgroundPage backgroundSource={require('../assets/images/bg/diynumber.png')}>

      {/* Top bar — back + title only */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle} numberOfLines={1}>{title}</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Transcript scroll area */}
      <ScrollView
        ref={scrollRef}
        style={styles.transcriptScroll}
        contentContainerStyle={styles.transcriptContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        decelerationRate="normal"  // slower feel
      >
        {segments.length > 0 ? (
          segments.map((seg, sIdx) => (
            <View
              key={sIdx}
              onLayout={(e) => {
                segmentYRef.current[sIdx] = e.nativeEvent.layout.y
              }}
              style={styles.segmentRow}
            >
              {seg.map((word, wIdx) => {
                const globalIdx = sIdx * CHUNK + wIdx
                const isPast = globalIdx < currentWordIndex
                const isCurrent = globalIdx === currentWordIndex
                return (
                  <TouchableOpacity
                    key={wIdx}
                    activeOpacity={0.6}
                    onPress={() => handleWordPress(globalIdx)}
                  >
                    <Text
                      style={[
                        styles.word,
                        isPast && styles.wordPast,
                        isCurrent && styles.wordCurrent,
                      ]}
                    >
                      {word.text}{' '}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          ))
        ) : (
          <Text style={styles.noTranscript}>
            {transcriptKey
              ? `No transcript found for "${transcriptKey}"`
              : 'No transcript available'}
          </Text>
        )}
      </ScrollView>

      {/* Draggable progress bar */}
      <View style={styles.progressRow}>
        <Text style={styles.timeLabel}>{formatTime(position)}</Text>
        <View
          style={styles.track}
          onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width }}
          {...panResponder.panHandlers}
        >
          <View style={[styles.fill, { width: `${displayProgress * 100}%` }]} />
          {/* Drag thumb */}
          <View style={[styles.thumb, { left: `${displayProgress * 100}%` }]} />
        </View>
        <Text style={styles.timeLabel}>{formatTime(duration)}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={handleStop}
          style={[styles.btn, styles.stopBtn]}
          activeOpacity={0.75}
        >
          <Text style={styles.btnIcon}>⏹</Text>
        </TouchableOpacity>
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

    </BackgroundPage>
  )
}

const styles = StyleSheet.create({
  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 52,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backBtn: { width: 70 },
  backText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  topTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },

  // Transcript
  transcriptScroll: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
  },
  transcriptContent: {
    padding: 18,
    paddingBottom: 30,
  },
  segmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  word: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '500',
    lineHeight: 34,
  },
  wordPast: {
    color: 'rgba(255,255,255,0.45)',
  },
  wordCurrent: {
    color: '#FF8DC7',
    fontWeight: '800',
    fontSize: 22,
  },
  noTranscript: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 30,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  timeLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontWeight: '600',
    minWidth: 36,
    textAlign: 'center',
  },
  track: {
    flex: 1,
    height: 20,           // tall hitbox for easy dragging
    justifyContent: 'center',
    position: 'relative',
  },
  fill: {
    height: 6,
    backgroundColor: '#FF8DC7',
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    top: 1,
    marginLeft: -9,       // center on fill edge
    shadowColor: '#FF8DC7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
  },

  // Controls
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 44,
  },
  btn: { alignItems: 'center', justifyContent: 'center', borderRadius: 50 },
  stopBtn: {
    width: 60, height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
  },
  playBtn: {
    width: 80, height: 80,
    backgroundColor: '#FF8DC7',
    shadowColor: '#FF8DC7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6, shadowRadius: 18, elevation: 10,
  },
  btnIcon: { fontSize: 28, color: '#fff' },
  playBtnIcon: { fontSize: 34 },
})