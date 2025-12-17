

// // app/(tabs)/profile.tsx
// import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
// import { useEffect, useState } from 'react'
// import { supabase } from '../../lib/supabase'
// import { Session } from '@supabase/supabase-js'
// import { useRouter } from 'expo-router'
// import { useLanguage } from '../../contexts/LanguageContext'

// export default function ProfileScreen() {
//   const [session, setSession] = useState<Session | null>(null)
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()
//   const { t, language } = useLanguage()

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session)
//     })
//   }, [])

//   async function signOut() {
//     setLoading(true)
//     const { error } = await supabase.auth.signOut()
//     if (error) {
//       Alert.alert(t('error'), error.message)
//     }
//     setLoading(false)
//   }

//   function handleDeleteAccount() {
//     router.push('/delete-confirmation')
//   }

//   function handleLanguageSelect() {
//     router.push('/language-select')
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{t('profile')}</Text>
      
//       {session && session.user && (
//         <View style={styles.profileInfo}>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>{t('email')}</Text>
//             <Text style={styles.value}>{session.user.email}</Text>
//           </View>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>{t('userId')}</Text>
//             <Text style={styles.value}>{session.user.id}</Text>
//           </View>
          
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>{t('createdAt')}</Text>
//             <Text style={styles.value}>
//               {new Date(session.user.created_at).toLocaleDateString()}
//             </Text>
//           </View>
//         </View>
//       )}

//       <TouchableOpacity
//         style={[styles.languageButton, loading && styles.buttonDisabled]}
//         onPress={handleLanguageSelect}
//         disabled={loading}
//       >
//         <Text style={styles.languageButtonText}>{t('selectLanguage')}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.signOutButton, loading && styles.buttonDisabled]}
//         onPress={signOut}
//         disabled={loading}
//       >
//         <Text style={styles.signOutButtonText}>{t('signOut')}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.deleteButton, loading && styles.buttonDisabled]}
//         onPress={handleDeleteAccount}
//         disabled={loading}
//       >
//         <Text style={styles.deleteButtonText}>{t('deleteAccount')}</Text>
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
//   languageButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   languageButtonText: {
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


import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { Session } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native';
import BackgroundPage from "@/components/props/peppabg";
const { width, height } = Dimensions.get("window");

const ProfilePage = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };
  
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
    router.push('/delete-confirmation');
  }

  function handleLanguageSelect() {
    router.push('/language-select');
  }

  return (
    <BackgroundPage
      backgroundSource={require('../../assets/images/bg/diybg.png')}

    > 
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

     
        {/* Session Information */}
        {session && session.user && (
          <View style={styles.sessionInfo}>
            <View style={styles.sessionRow}>
              <Text style={styles.sessionLabel}>{t('email')}</Text>
              <Text style={styles.sessionValue}>{session.user.email}</Text>
            </View>
            
            <View style={styles.sessionRow}>
              <Text style={styles.sessionLabel}>{t('userId')}</Text>
              <Text style={styles.sessionValue}>{session.user.id}</Text>
            </View>
            
            <View style={styles.sessionRow}>
              <Text style={styles.sessionLabel}>{t('createdAt')}</Text>
              <Text style={styles.sessionValue}>
                {new Date(session.user.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {/* Application Language */}
          <TouchableOpacity 
            style={[styles.menuItem, loading && styles.menuItemDisabled]}
            onPress={handleLanguageSelect}
            disabled={loading}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="language" size={24} color="#5B8DEE" />
              </View>
              <Text style={styles.menuText}>{t('selectLanguage')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Write to Us */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="chatbubble-outline" size={24} color="#5B8DEE" />
              </View>
              <Text style={styles.menuText}>Write to Us</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Rate App */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="star-outline" size={24} color="#5B8DEE" />
              </View>
              <Text style={styles.menuText}>Rate App</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* More */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="settings-outline" size={24} color="#5B8DEE" />
              </View>
              <Text style={styles.menuText}>More</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Sign Out */}
          <TouchableOpacity
            style={[styles.menuItem, loading && styles.menuItemDisabled]}
            onPress={signOut}
            disabled={loading}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="log-out-outline" size={24} color="#5B8DEE" />
              </View>
              <Text style={styles.menuText}>{t('signOut')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity
            style={[styles.menuItem, styles.deleteMenuItem, loading && styles.menuItemDisabled]}
            onPress={handleDeleteAccount}
            disabled={loading}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconContainer, styles.deleteIconContainer]}>
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              </View>
              <Text style={[styles.menuText, styles.deleteMenuText]}>{t('deleteAccount')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
     </BackgroundPage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  backArrow: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
    marginRight: 6,
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  userPhone: {
    color: "#B8C5D6",
    fontSize: 14,
    marginTop: 4,
  },
  sessionInfo: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "rgba(30, 58, 120, 0.6)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(91, 141, 238, 0.3)",
  },
  sessionRow: {
    marginBottom: 16,
  },
  sessionLabel: {
    fontSize: 12,
    color: "#B8C5D6",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sessionValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    gap: 14,
  },
  menuItem: {
    backgroundColor: "rgba(30, 58, 120, 0.6)",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(91, 141, 238, 0.3)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  deleteMenuItem: {
    borderColor: "rgba(255, 59, 48, 0.3)",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(91, 141, 238, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIconContainer: {
    backgroundColor: "rgba(255, 59, 48, 0.2)",
  },
  menuText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteMenuText: {
    color: "#FF3B30",
  },
});

export default ProfilePage;