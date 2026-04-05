import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import BackgroundPage from "@/components/props/peppabg";

const TALES = [
  {
    id: '1',
    title: 'Learn with Peppa',
    image: require('../assets/images/home/learn-with-peppa.png'),
    duration: '6.30',
  },
  {
    id: '2',
    title: 'Bedtime Stories with Peppa',
    image: require('../assets/images/home/bedtime-stories.png'),
    duration: '5.00',
  },
]

export default function TalesPerformScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()

  const tale = TALES.find(t => t.id === id) ?? TALES[0]

  return (
    <BackgroundPage backgroundSource={require("../assets/images/bg/tales.png")}>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Page Title */}
      <Text style={styles.pageTitle}>Tales</Text>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {TALES.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.85}
            style={styles.card}
            onPress={() => console.log('Play:', item.title)}
          >
            {/* Card Image */}
            <View style={styles.imageWrapper}>
              <Image source={item.image} style={styles.cardImage} resizeMode="cover" />

              {/* Overlay: title + icons + duration */}
              <View style={styles.overlay}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.icons}>
                    <Text style={styles.icon}>🎵</Text>
                    <Text style={styles.icon}>📖</Text>
                    <Text style={styles.icon}>✨</Text>
                  </View>
                  <Text style={styles.duration}>{item.duration}</Text>
                </View>
              </View>
            </View>
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
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginLeft: 24,
    marginTop: 4,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 24,
    marginTop: 8,
  },

  /* Card — purple bordered rounded card like in the image */
  card: {
    width: 360,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#A855F7',
    overflow: 'hidden',
    backgroundColor: '#1a0030',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  imageWrapper: {
    width: '100%',
    height: 240,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },

  /* Dark gradient-like overlay at the bottom of the image */
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(20, 0, 50, 0.65)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icons: {
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    fontSize: 18,
  },
  duration: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
})