// import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
// import { useEffect, useState } from 'react'
// import { supabase } from '../../lib/supabase'
// import { Session } from '@supabase/supabase-js'
// import { useRouter } from 'expo-router'

// export default function ProfileScreen() {
//   const [session, setSession] = useState<Session | null>(null)
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session)
//     })
//   }, [])

//   async function signOut() {
//     setLoading(true)
//     const { error } = await supabase.auth.signOut()
//     if (error) {
//       Alert.alert('Error', error.message)
//     }
//     setLoading(false)
//   }

//   function handleDeleteAccount() {
//     router.push('/delete-confirmation')
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Profile</Text>
      
//       {session && session.user && (
//         <View style={styles.profileInfo}>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Email</Text>
//             <Text style={styles.value}>{session.user.email}</Text>
//           </View>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>User ID</Text>
//             <Text style={styles.value}>{session.user.id}</Text>
//           </View>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Created At</Text>
//             <Text style={styles.value}>
//               {new Date(session.user.created_at).toLocaleDateString()}
//             </Text>
//           </View>
//         </View>
//       )}

      

//       <TouchableOpacity
//         style={[styles.deleteButton, loading && styles.buttonDisabled]}
//         onPress={handleDeleteAccount}
//         disabled={loading}
//       >
//         <Text style={styles.deleteButtonText}>Delete Account</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginTop: 48,
//     marginBottom: 24,
//   },
//   profileInfo: {
//     backgroundColor: '#f5f5f5',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 24,
//   },
//   infoRow: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 4,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   value: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   signOutButton: {
//     backgroundColor: '#ff3b30',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   buttonDisabled: {
//     opacity: 0.5,
//   },
//   signOutButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   deleteButton: {
//     backgroundColor: '#8B0000',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//   },
//   deleteButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// })


// app/(tabs)/profile.tsx
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'expo-router'
import { useLanguage } from '../../contexts/LanguageContext'

export default function ProfileScreen() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t, language } = useLanguage()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  async function signOut() {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      Alert.alert(t('error'), error.message)
    }
    setLoading(false)
  }

  function handleDeleteAccount() {
    router.push('/delete-confirmation')
  }

  function handleLanguageSelect() {
    router.push('/language-select')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile')}</Text>
      
      {session && session.user && (
        <View style={styles.profileInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('email')}</Text>
            <Text style={styles.value}>{session.user.email}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('userId')}</Text>
            <Text style={styles.value}>{session.user.id}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('createdAt')}</Text>
            <Text style={styles.value}>
              {new Date(session.user.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.languageButton, loading && styles.buttonDisabled]}
        onPress={handleLanguageSelect}
        disabled={loading}
      >
        <Text style={styles.languageButtonText}>{t('selectLanguage')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.signOutButton, loading && styles.buttonDisabled]}
        onPress={signOut}
        disabled={loading}
      >
        <Text style={styles.signOutButtonText}>{t('signOut')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteButton, loading && styles.buttonDisabled]}
        onPress={handleDeleteAccount}
        disabled={loading}
      >
        <Text style={styles.deleteButtonText}>{t('deleteAccount')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 48,
    marginBottom: 24,
  },
  profileInfo: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  signOutButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  languageButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#8B0000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})