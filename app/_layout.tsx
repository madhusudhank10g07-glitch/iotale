// import { useEffect, useState } from 'react'
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
// import { Stack, useRouter, useSegments } from 'expo-router'
// import { StatusBar } from 'expo-status-bar'
// import { Session } from '@supabase/supabase-js'
// import 'react-native-reanimated'

// import { useColorScheme } from '@/hooks/use-color-scheme'
// import { supabase } from '../lib/supabase'
// import { LanguageProvider } from '../contexts/LanguageContext'
// import SplashScreen from '../components/SplashScreen'

// export const unstable_settings = {
//   anchor: '(tabs)',
// }

// export default function RootLayout() {
//   const colorScheme = useColorScheme()
//   const [session, setSession] = useState<Session | null>(null)
//   const [loading, setLoading] = useState(true)
//   const segments = useSegments()
//   const router = useRouter()
//   const [showSplash, setShowSplash] = useState(true)

//   // Splash screen timer - runs once on mount
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowSplash(false)
//     }, 8000) // 8 seconds as requested

//     return () => clearTimeout(timer)
//   }, [])

//   // Get initial session and listen for auth changes
//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session)
//       setLoading(false)
//     })

//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//     })

//     return () => subscription.unsubscribe()
//   }, [])

//   // Handle navigation based on auth state
//   useEffect(() => {
//     if (loading) return

//     const inAuthGroup = segments[0] === '(auth)'

//     if (!session && !inAuthGroup) {
//       router.replace('/(auth)/sign-in')
//     } else if (session && inAuthGroup) {
//       router.replace('/(tabs)')
//     }
//   }, [session, segments, loading])

//   // Show splash screen first (all hooks are called before this)
//   if (showSplash) {
//     return <SplashScreen />
//   }

//   // Show loading state
//   if (loading) {
//     return null
//   }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <LanguageProvider>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="(auth)" />
//           <Stack.Screen name="(tabs)" />
//         </Stack>
//         <StatusBar style="auto" />
//       </LanguageProvider>
//     </ThemeProvider>
//   )
// }

import { useEffect, useState } from 'react'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Session } from '@supabase/supabase-js'
import { View, ActivityIndicator } from 'react-native' // Import these!
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/use-color-scheme'
import { supabase } from '../lib/supabase'
import { LanguageProvider } from '../contexts/LanguageContext'
import SplashScreen from '../components/SplashScreen'

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const segments = useSegments()
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // FIX 1: Handle errors here so loading doesn't get stuck
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.log("Supabase Error:", error);
      setSession(session)
      setLoading(false)
    }).catch(err => {
      console.log("Supabase critical fail:", err);
      setLoading(false); // Force loading off even if it fails
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (loading) return
    const inAuthGroup = segments[0] === '(auth)'
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/sign-in')
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [session, segments, loading])

  if (showSplash) {
    return <SplashScreen />
  }

  // FIX 2: Never return 'null'. Show a spinner so you know the app is alive.
 

  return (
    // FIX 3: Critical Flex Container for Android
    <View style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <LanguageProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style="auto" />
        </LanguageProvider>
      </ThemeProvider>
    </View>
  )
}