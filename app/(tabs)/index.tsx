

import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Session } from '@supabase/supabase-js'
import BackgroundPage from '@/components/props/peppabg'
import { useRouter } from 'expo-router'   // ← add this import

export default function HomeScreen() {
  const [session, setSession] = useState<Session | null>(null)
const router = useRouter() 
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  return (
    <BackgroundPage
      backgroundSource={require('../../assets/images/bg/homebg.png')}

    > 

    
<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
  <Text style={styles.pageTitle}>Pick your tale</Text>

  <TouchableOpacity style={styles.card} activeOpacity={0.85}  onPress={() => router.push('/peppatales')}  >
    <Image
      source={require('../../assets/images/home/tales-collections-banner.png')}
      style={styles.cardImage}
      resizeMode="cover"
      
    />
    <Text style={styles.cardTitle}>Tales Collections</Text>
  </TouchableOpacity>


  {/* tut */}
  {/* Tutorial Card */}
<TouchableOpacity style={styles.tutorialCard} activeOpacity={0.85}>
  <Text style={styles.tutorialText}>Watch the tutorial before starting to play</Text>
  <Image
    source={require('../../assets/images/home/play-button.png')}
    style={styles.playButton}
    resizeMode="contain"
  />
</TouchableOpacity>

{/* New Tales Section */}
<Text style={styles.pageTitle}>New Tales</Text>

<TouchableOpacity style={styles.card} activeOpacity={0.85}>
  <Image
    source={require('../../assets/images/home/new-tales-banner.png')}
    style={styles.cardImage}
    resizeMode="cover"
  />
</TouchableOpacity>
</ScrollView>
     </BackgroundPage>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  userInfo: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },


  scrollContent: {
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 40,
  alignItems: 'center',
},
pageTitle: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#FFFFFF',
  textAlign: 'center',
  marginBottom: 16,
},
card: {
  width: '90%',
  backgroundColor: '#1A3A8C',
  borderRadius: 20,
  overflow: 'hidden',
  paddingBottom: 16,
    padding: 18, 
    marginTop: 20,
},
cardImage: {
  width: '100%',
  height: 150,
  borderRadius: 14,   
},
cardTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#FFFFFF',
  textAlign: 'center',
  marginTop: 12,
},

// card

tutorialCard: {
  width: '90%',
  backgroundColor: '#1A3A8C',
  borderRadius: 20,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 20,
  paddingHorizontal: 20,
  marginTop: 16,
},
tutorialText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#FFFFFF',
  flex: 1,
  flexWrap: 'wrap',
  marginRight: 20,
},
playButton: {
  width: 65,
  height: 70,
  marginTop:30,
},
})