// app/peppatales.tsx

import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import BackgroundPage from "@/components/props/peppabg"
import { CATEGORY_FOLDERS } from '@/constants/supabaseConfig'

// Map category id → local image
const CATEGORY_IMAGES: Record<string, any> = {
  learn:   require('../assets/images/home/learn-with-peppa.png'),
  bedtime: require('../assets/images/home/bedtime-stories.png'),
}

export default function TalesScreen() {
  const router = useRouter()

  return (
    <BackgroundPage backgroundSource={require('../assets/images/bg/tales.png')}>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {CATEGORY_FOLDERS.map((cat) => (
          <TouchableOpacity
  key={cat.id}
  activeOpacity={0.85}
  onPress={() => router.push(`/taleperform?id=${cat.id}`)}
>
            <View style={styles.imageWrapper}>
              <Image
                source={CATEGORY_IMAGES[cat.id]}
                style={styles.taleImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.taleTitle}>{cat.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

    </BackgroundPage>
  )
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 16,
    marginLeft: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 28,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 24,
    marginTop: 20,
  },
  imageWrapper: {
    width: 360,
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taleImage: {
    width: 360,
    height: 240,
  },
  taleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
})