 
// import { AppState, Platform } from 'react-native'
// import 'react-native-url-polyfill/auto'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { createClient, processLock } from '@supabase/supabase-js'

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// })

// // Auto-refresh session when app is in foreground
// if (Platform.OS !== "web") {
//   AppState.addEventListener('change', (state) => {
//     if (state === 'active') {
//       supabase.auth.startAutoRefresh()
//     } else {
//       supabase.auth.stopAutoRefresh()
//     }
//   })
// }


import { AppState, Platform } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

console.log('Initializing Supabase...');
console.log('URL:', supabaseUrl);
console.log('Platform:', Platform.OS);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // Add these for Android
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-react-native',
    },
  },
  // Add fetch timeout
  realtime: {
    timeout: 10000,
  },
})

// Auto-refresh session when app is in foreground
AppState.addEventListener('change', (state) => {
  console.log('App state changed to:', state);
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})