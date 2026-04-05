import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import BackgroundPage from "@/components/props/peppabg";

const TALES = [
  {
    id: '1',
    title: 'Learn with Peppa',
    image: require('../assets/images/home/learn-with-peppa.png'),
  },
  {
    id: '2',
    title: 'Bedtime Stories with Peppa',
    image: require('../assets/images/home/bedtime-stories.png'),
  },
]

export default function TalesScreen() {
  const router = useRouter()

  return (
    <BackgroundPage backgroundSource={require("../assets/images/bg/tales.png")}>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8} >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {TALES.map((tale) => (
          <TouchableOpacity
            key={tale.id}
            activeOpacity={0.85}
           onPress={() => router.push(`/taleperform?id=${tale.id}`)}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={tale.image}
                style={styles.taleImage}
                resizeMode="contain"   // ← shows full image, no cropping
              />
            </View>
            <Text style={styles.taleTitle}>{tale.title}</Text>
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
    marginTop:28,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 24,
    marginTop: 20,
  },
  imageWrapper: {
    width: 360,   // ← was 320
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',  // ← no background fill, clean look
    justifyContent: 'center',
    alignItems: 'center',
  },
  taleImage: {
    width: 360,   // ← was 320
    height: 240,  // same fixed dimensions as wrapper
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