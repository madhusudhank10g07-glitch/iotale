import React, { useMemo } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import * as FileSystem from 'expo-file-system/legacy'
import {
  ArrowLeft,
  FileText,
  MessageCircle,
  Wand2,
  CheckCircle2,
  Castle,
  Ghost,
  UserRound,
  User,
} from 'lucide-react-native'
import { useAudioDownload } from '@/hooks/useAudioDownload'

const { height } = Dimensions.get('window')

function CharacterItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.characterItem}>
      <View style={styles.characterIconBg}>{icon}</View>
      <Text style={styles.characterLabel}>{label}</Text>
    </View>
  )
}

export default function StartTalesScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    trackId?: string | string[]
    title?: string | string[]
    categoryTitle?: string | string[]
    fileSizeBytes?: string | string[]
    fileName?: string | string[]
    audioUri?: string | string[]
  }>()

  const trackId = useMemo(() => {
    const v = params.trackId
    return Array.isArray(v) ? v[0] : v
  }, [params.trackId])

  const title = useMemo(() => {
    const v = params.title
    return Array.isArray(v) ? v[0] : (v ?? 'Untitled')
  }, [params.title])

  const categoryTitle = useMemo(() => {
    const v = params.categoryTitle
    return Array.isArray(v) ? v[0] : (v ?? 'Stories')
  }, [params.categoryTitle])

  const fileName = useMemo(() => {
    const v = params.fileName
    return Array.isArray(v) ? v[0] : v
  }, [params.fileName])

  const fileSizeLabel = useMemo(() => {
    const v = params.fileSizeBytes
    const raw = Array.isArray(v) ? v[0] : v
    if (!raw) return null
    const bytes = parseInt(raw, 10)
    if (isNaN(bytes)) return null
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }, [params.fileSizeBytes])

  const audioUriFromParams = useMemo(() => {
    const v = params.audioUri
    const raw = Array.isArray(v) ? v[0] : v
    return raw ? decodeURIComponent(raw) : undefined
  }, [params.audioUri])

  const localAudioUri = useMemo(() => {
    if (audioUriFromParams) return audioUriFromParams
    if (!fileName) return undefined

    const base = FileSystem.documentDirectory ?? ''
    return `${base}peppa_audio/${fileName}`
  }, [audioUriFromParams, fileName])

  function handleBeginPerform() {
    if (!localAudioUri) return

    router.push({
      pathname: '/perform',
      params: {
        uri: encodeURIComponent(localAudioUri),
        title,
        categoryTitle,
      },
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?q=80&w=800&auto=format&fit=crop',
          }}
          style={styles.backgroundImage}
        />
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft color="#fff" size={24} strokeWidth={3} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text style={styles.subtitle}>{categoryTitle}</Text>
          <Text style={styles.title}>{title}</Text>

          {fileSizeLabel && (
            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeIcon}>🎵</Text>
              <Text style={styles.timeText}>{fileSizeLabel}</Text>
            </View>
          )}

          <Text style={styles.description}>
            Tap "Begin to Perform" to start the interactive story experience
            with narration, sound effects, and characters.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inside the tale</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.75}>
              <FileText color="#93c5fd" size={28} />
              <Text style={styles.actionText}>Text</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.75}>
              <MessageCircle color="#93c5fd" size={28} />
              <Text style={styles.actionText}>Narration</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.75}>
              <Wand2 color="#93c5fd" size={28} />
              <Text style={styles.actionText}>SFX</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.characterDesc}>
            Get your characters ready for the performance of{' '}
            <Text style={{ color: '#f48fb1', fontWeight: '700' }}>{title}</Text>
          </Text>
          <View style={styles.characterGrid}>
            <CharacterItem icon={<Castle color="#93c5fd" size={36} />} label="Castle" />
            <CharacterItem icon={<UserRound color="#93c5fd" size={36} />} label="Grandma" />
            <CharacterItem icon={<Ghost color="#93c5fd" size={36} />} label="Monster" />
            <CharacterItem icon={<User color="#93c5fd" size={36} />} label="Girl" />
            <CharacterItem icon={<User color="#93c5fd" size={36} />} label="Boy" />
            <CharacterItem icon={<User color="#93c5fd" size={36} />} label="Wolf" />
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, !localAudioUri && styles.fabDisabled]}
          activeOpacity={0.85}
          onPress={handleBeginPerform}
          disabled={!localAudioUri}
        >
          <Text style={styles.fabText}>Begin to Perform</Text>
          <CheckCircle2 color="#fff" size={24} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b2756' },
  backgroundContainer: {
    position: 'absolute', top: 0, left: 0,
    width: '100%', height: height * 0.5, opacity: 0.35,
  },
  backgroundImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  header: { paddingTop: 60, paddingHorizontal: 24, zIndex: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  scrollView: { flex: 1, zIndex: 10 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  heroSection: { alignItems: 'center', marginTop: 20 },
  subtitle: {
    color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '700',
    letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10,
  },
  title: {
    color: '#fff', fontSize: 32, fontWeight: '900',
    textAlign: 'center', marginBottom: 16, lineHeight: 40,
  },
  timeBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)', paddingHorizontal: 16,
    paddingVertical: 7, borderRadius: 20, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 6,
  },
  timeBadgeIcon: { fontSize: 14 },
  timeText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  description: {
    color: 'rgba(255,255,255,0.75)', fontSize: 14,
    textAlign: 'center', fontWeight: '500', maxWidth: 290, lineHeight: 22,
  },
  section: { marginTop: 44, alignItems: 'center' },
  sectionTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 22 },
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, width: '100%' },
  actionCard: {
    width: 88, height: 96, backgroundColor: '#163870', borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  actionText: { color: '#bfdbfe', fontSize: 11, fontWeight: '700', marginTop: 8 },
  characterDesc: {
    color: 'rgba(255,255,255,0.75)', fontSize: 14, textAlign: 'center',
    fontWeight: '500', marginBottom: 28, maxWidth: 300, lineHeight: 22,
  },
  characterGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
  characterItem: { alignItems: 'center', width: 80, marginBottom: 8 },
  characterIconBg: {
    width: 68, height: 68, borderRadius: 34, backgroundColor: '#163870',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  characterLabel: { color: '#bfdbfe', fontSize: 11, fontWeight: '600' },
  fabContainer: {
    position: 'absolute', bottom: 40, left: 0,
    width: '100%', alignItems: 'center', zIndex: 30,
  },
  fab: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f48fb1', width: 300, height: 64, borderRadius: 32, gap: 12,
    shadowColor: '#f48fb1', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 18, elevation: 10,
  },
  fabDisabled: { opacity: 0.45 },
  fabText: { color: '#fff', fontSize: 18, fontWeight: '800' },
})