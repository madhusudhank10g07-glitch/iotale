
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
// import { useLocalSearchParams, useRouter } from 'expo-router'
// import { useEffect, useRef, useState } from 'react'
// import { Audio } from 'expo-av'
// import { LinearGradient } from 'expo-linear-gradient'

// export default function PerformScreen() {
//   const router = useRouter()
//   const { uri, title, categoryTitle } = useLocalSearchParams<{
//     uri: string
//     title: string
//     categoryTitle: string
//   }>()

//   // ✅ Use a ref so the cleanup function always sees the latest sound instance
//   const soundRef = useRef<Audio.Sound | null>(null)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [position, setPosition] = useState(0)
//   const [duration, setDuration] = useState(1)
//   const [loadError, setLoadError] = useState<string | null>(null)

//   useEffect(() => {
//     // ✅ Guard: bail out early if uri is missing or malformed
//     if (!uri || uri.startsWith('undefined') || uri.trim() === '') {
//       setLoadError('Audio file path is invalid. Please go back and try again.')
//       return
//     }

//     let isMounted = true

//     async function setup() {
//       try {
//         await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })

//         const { sound: s } = await Audio.Sound.createAsync(
//           { uri },
//           { shouldPlay: true },
//           (status) => {
//             if (!isMounted) return
//             if (status.isLoaded) {
//               setPosition(status.positionMillis)
//               setDuration(status.durationMillis ?? 1)
//               setIsPlaying(status.isPlaying)
//             }
//           }
//         )

//         if (!isMounted) {
//           // Component unmounted while loading — clean up immediately
//           s.unloadAsync()
//           return
//         }

//         soundRef.current = s
//       } catch (e: any) {
//         if (isMounted) {
//           setLoadError(e?.message ?? 'Failed to load audio.')
//         }
//       }
//     }

//     setup()

//     return () => {
//       isMounted = false
//       // ✅ Always unload via ref, never via stale state
//       soundRef.current?.unloadAsync()
//       soundRef.current = null
//     }
//   }, [uri])

//   const progress = duration > 1 ? position / duration : 0

//   const handlePlay = () => soundRef.current?.playAsync()
//   const handlePause = () => soundRef.current?.pauseAsync()
//   const handleSeekBack = () =>
//     soundRef.current?.setPositionAsync(Math.max(0, position - 10_000))
//   const handleSeekForward = () =>
//     soundRef.current?.setPositionAsync(Math.min(duration, position + 10_000))

//   // Format ms → mm:ss
//   const fmt = (ms: number) => {
//     const s = Math.floor(ms / 1000)
//     const m = Math.floor(s / 60)
//     return `${m}:${String(s % 60).padStart(2, '0')}`
//   }

//   return (
//     <LinearGradient colors={['#06174A', '#132D80']} style={styles.container}>
//       {/* Back */}
//       <TouchableOpacity onPress={() => router.back()} style={styles.back}>
//         <Text style={styles.white}>← Back</Text>
//       </TouchableOpacity>

//       {/* Art */}
//       <View style={styles.artContainer}>
//         <View style={styles.circle}>
//           <Text style={styles.emoji}>📖</Text>
//         </View>
//         <Text style={styles.title}>{title ?? 'Story'}</Text>
//         <Text style={styles.sub}>{categoryTitle ?? ''}</Text>
//       </View>

//       {/* Error state */}
//       {loadError ? (
//         <View style={styles.transcriptBox}>
//           <Text style={[styles.transcriptText, { color: '#ff6b6b' }]}>
//             ⚠️ {loadError}
//           </Text>
//         </View>
//       ) : (
//         /* Transcript placeholder */
//         <View style={styles.transcriptBox}>
//           <Text style={styles.transcriptText}>
//             "Once upon a time in a land far away..."
//           </Text>
//         </View>
//       )}

//       {/* Progress bar + timestamps */}
//       <View style={styles.progressRow}>
//         <View style={styles.track}>
//           <View style={[styles.fill, { width: `${progress * 100}%` }]} />
//         </View>
//         <View style={styles.timestamps}>
//           <Text style={styles.timeText}>{fmt(position)}</Text>
//           <Text style={styles.timeText}>{fmt(duration)}</Text>
//         </View>
//       </View>

//       {/* Controls */}
//       <View style={styles.controls}>
//         <TouchableOpacity onPress={handleSeekBack}>
//           <Text style={styles.btnSmall}>⏪</Text>
//         </TouchableOpacity>

//         {isPlaying ? (
//           <TouchableOpacity onPress={handlePause}>
//             <Text style={styles.btnText}>⏸</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity onPress={handlePlay}>
//             <Text style={styles.btnText}>▶</Text>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity onPress={handleSeekForward}>
//           <Text style={styles.btnSmall}>⏩</Text>
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   )
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   white: { color: '#fff', fontWeight: 'bold' },
//   back: { marginTop: 44 },
//   artContainer: { alignItems: 'center', marginTop: 36 },
//   circle: {
//     width: 120, height: 120, borderRadius: 60,
//     backgroundColor: '#FF8DC7',
//     justifyContent: 'center', alignItems: 'center',
//   },
//   emoji: { fontSize: 50 },
//   title: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 18, textAlign: 'center' },
//   sub: { color: 'rgba(255,255,255,0.5)', fontSize: 15, marginTop: 4 },
//   transcriptBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
//   transcriptText: {
//     color: '#fff', fontSize: 19, textAlign: 'center',
//     fontStyle: 'italic', lineHeight: 30,
//   },
//   progressRow: { marginHorizontal: 4, marginBottom: 12 },
//   track: {
//     height: 6, backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 3, overflow: 'hidden',
//   },
//   fill: { height: '100%', backgroundColor: '#FF8DC7', borderRadius: 3 },
//   timestamps: {
//     flexDirection: 'row', justifyContent: 'space-between', marginTop: 6,
//   },
//   timeText: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
//   controls: {
//     flexDirection: 'row', justifyContent: 'center',
//     alignItems: 'center', gap: 36, marginBottom: 48,
//   },
//   btnText: { fontSize: 48, color: '#fff' },
//   btnSmall: { fontSize: 30, color: 'rgba(255,255,255,0.75)' },
// })


// app/perform.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Audio } from 'expo-av'
import { LinearGradient } from 'expo-linear-gradient'

export default function PerformScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    uri?: string | string[]
    title?: string | string[]
    categoryTitle?: string | string[]
  }>()

const uri = useMemo(() => {
  const value = params.uri
  const raw = Array.isArray(value) ? value[0] : value
  return raw ? decodeURIComponent(raw) : undefined
}, [params.uri])

useEffect(() => {
  let mounted = true
  let localSound: Audio.Sound | null = null

  async function setup() {
    try {
      if (!uri) {
        throw new Error('Missing audio uri')
      }

      console.log('Playing URI:', uri)

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      })

      const result = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        (status) => {
          if (!mounted) return
          if (status.isLoaded) {
            setPosition(status.positionMillis ?? 0)
            setDuration(status.durationMillis || 1)
            setIsPlaying(status.isPlaying)
          }
        }
      )

      localSound = result.sound
      if (mounted) setSound(result.sound)
      else await result.sound.unloadAsync()
    } catch (error) {
      console.warn('Failed to load audio:', error)
    }
  }

  setup()

  return () => {
    mounted = false
    if (localSound) {
      
      localSound.unloadAsync().catch(() => {})
    }
  }
}, [uri])

  const title = useMemo(() => {
    const value = params.title
    return Array.isArray(value) ? value[0] : value
  }, [params.title])

  const categoryTitle = useMemo(() => {
    const value = params.categoryTitle
    return Array.isArray(value) ? value[0] : value
  }, [params.categoryTitle])

  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(1)

  useEffect(() => {
    let mounted = true
    let localSound: Audio.Sound | null = null

    async function setup() {
      try {
        if (!uri) return

        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        })

        const result = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          (status) => {
            if (!mounted) return
            if (status.isLoaded) {
              setPosition(status.positionMillis ?? 0)
              setDuration(status.durationMillis || 1)
              setIsPlaying(status.isPlaying)
            }
          }
        )

        localSound = result.sound
        if (mounted) {
          setSound(result.sound)
        } else {
          await result.sound.unloadAsync()
        }
      } catch (error) {
        console.warn('Failed to load audio:', error)
      }
    }

    setup()

    return () => {
      mounted = false
      if (localSound) {
        localSound.unloadAsync().catch(() => {})
      }
    }
  }, [uri])

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0

  const handlePlayPause = async () => {
    try {
      if (!sound) return
      if (isPlaying) {
        await sound.pauseAsync()
      } else {
        await sound.playAsync()
      }
    } catch (error) {
      console.warn('Playback error:', error)
    }
  }

  return (
    <LinearGradient colors={['#06174A', '#132D80']} style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.white}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.artContainer}>
        <View style={styles.circle}>
          <Text style={styles.emoji}>📖</Text>
        </View>
        <Text style={styles.title}>{title ?? 'Untitled'}</Text>
        <Text style={styles.sub}>{categoryTitle ?? 'Uncategorized'}</Text>
      </View>

      <View style={styles.transcriptBox}>
        <Text style={styles.transcriptText}>
          &quot;Once upon a time in a land far away...&quot;
        </Text>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePlayPause} style={styles.controlButton}>
          <Text style={styles.btnText}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  white: {
    color: '#fff',
    fontWeight: 'bold',
  },
  back: {
    marginTop: 40,
    alignSelf: 'flex-start',
  },
  artContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF8DC7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 50,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 20,
    textAlign: 'center',
  },
  sub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    marginTop: 6,
    textAlign: 'center',
  },
  transcriptBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  transcriptText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 30,
  },
  progressRow: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 10,
  },
  track: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#FF8DC7',
    borderRadius: 3,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  btnText: {
    fontSize: 40,
    color: '#fff',
  },
})