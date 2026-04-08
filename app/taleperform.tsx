
// app/talesperform.tsx

import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import BackgroundPage from '@/components/props/peppabg'
import { useSupabaseAudioList, RemoteTrack } from '@/hooks/useSupabaseAudioList'
import { useAudioDownload } from '@/hooks/useAudioDownload'
import { CATEGORY_FOLDERS } from '@/constants/supabaseConfig'

// ─── Single track card ───────────────────────────────────────────────────────

// function TrackCard({ track }: { track: RemoteTrack }) {
//   const router = useRouter()
//   const { isDownloaded, isDownloading, progress, error, download, audioUri } =
//     useAudioDownload(track)

//   async function handlePress() {
//     if (!isDownloaded) {
//       await download()
//       return
//     }

//     router.push({
//       pathname: '/starttales',
//       params: {
//         uri: encodeURIComponent(audioUri),
//         title: track.title,
//         categoryTitle: track.categoryTitle,
//       },
//     })
//   }

function TrackCard({ track }: { track: RemoteTrack }) {
  const router = useRouter()
  const { isDownloaded, isDownloading, progress, error, download, audioUri } =
    useAudioDownload(track)

  async function handlePress() {
    if (!isDownloaded) {
      await download()
      return
    }

    router.push({
      pathname: '/starttales',
      params: {
        trackId: track.id,
        title: track.title,
        categoryTitle: track.categoryTitle,
        fileSizeBytes: track.fileSizeBytes?.toString() ?? '',
        fileName: track.fileName, // ✅ add this
        audioUri: audioUri ?? '',  // optional fallback
      },
    })
  }


  const fileMB = track.fileSizeBytes
    ? `${(track.fileSizeBytes / 1024 / 1024).toFixed(1)} MB`
    : ''

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={handlePress}
    >
      {/* Status badge */}
      <View style={styles.badgeWrap}>
        {isDownloaded ? (
          <View style={[styles.badge, styles.badgeGreen]}>
            <Text style={styles.badgeText}>✓ Ready</Text>
          </View>
        ) : isDownloading ? (
          <View style={[styles.badge, styles.badgePurple]}>
            <Text style={styles.badgeText}>{Math.round(progress * 100)}%</Text>
          </View>
        ) : (
          <View style={[styles.badge, styles.badgeGray]}>
            <Text style={styles.badgeText}>⬇ Download</Text>
          </View>
        )}
      </View>

      <View style={styles.overlay}>
        <Text style={styles.cardTitle}>{track.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.icons}>
            <Text style={styles.icon}>🎵</Text>
            <Text style={styles.icon}>✨</Text>
          </View>
          {fileMB ? (
            <Text style={styles.sizeText}>{fileMB}</Text>
          ) : null}
        </View>

        {isDownloading && (
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]}
            />
          </View>
        )}

        {error && (
          <Text style={styles.errorText}>⚠️ {error}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function TalesPerformScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { tracks, loading, error, refetch } = useSupabaseAudioList()

  const category = CATEGORY_FOLDERS.find(c => c.id === id) ?? CATEGORY_FOLDERS[0]
  const filtered = tracks.filter(t => t.categoryId === (id ?? CATEGORY_FOLDERS[0].id))

  return (
    <BackgroundPage backgroundSource={require('../assets/images/bg/tales.png')}>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>{category.title}</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#A855F7" />
          <Text style={styles.loadingText}>Loading stories...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorBig}>⚠️ {error}</Text>
          <TouchableOpacity onPress={refetch} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.pageSubtitle}>{filtered.length} stories</Text>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filtered.map(track => (
              <TrackCard key={track.id} track={track} />
            ))}
          </ScrollView>
        </>
      )}

    </BackgroundPage>
  )
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 16, marginLeft: 20,
    paddingVertical: 8, paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 16, fontWeight: '700', color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2,
  },
  pageTitle: {
    fontSize: 28, fontWeight: '900', color: '#FFFFFF',
    marginLeft: 24, marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 4,
  },
  pageSubtitle: {
    fontSize: 14, fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 26, marginTop: 2, marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 20, paddingBottom: 40,
    alignItems: 'center', gap: 20, marginTop: 8,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: 'rgba(255,255,255,0.6)', fontSize: 15 },
  errorBig: { color: '#ff6b6b', fontSize: 15, textAlign: 'center' },
  retryBtn: {
    backgroundColor: '#A855F7', paddingHorizontal: 24,
    paddingVertical: 10, borderRadius: 20,
  },
  retryText: { color: '#fff', fontWeight: '700' },
  card: {
    width: 360, borderRadius: 24, borderWidth: 3,
    borderColor: '#A855F7', overflow: 'hidden',
    backgroundColor: '#1a0030',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5, shadowRadius: 12, elevation: 10,
    position: 'relative',
  },
  badgeWrap: { position: 'absolute', top: 12, right: 12, zIndex: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeGreen: {
    backgroundColor: 'rgba(74,222,128,0.25)',
    borderWidth: 1, borderColor: '#4ade80',
  },
  badgePurple: {
    backgroundColor: 'rgba(168,85,247,0.35)',
    borderWidth: 1, borderColor: '#A855F7',
  },
  badgeGray: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  overlay: {
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: 'rgba(20, 0, 50, 0.75)',
  },
  cardTitle: {
    fontSize: 18, fontWeight: '800', color: '#FFFFFF',
    marginBottom: 8, marginRight: 80,
  },
  metaRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  icons: { flexDirection: 'row', gap: 10 },
  icon: { fontSize: 18 },
  sizeText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  progressTrack: {
    marginTop: 10, height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#A855F7', borderRadius: 2 },
  errorText: { color: '#ff6b6b', fontSize: 12, marginTop: 6 },
})

