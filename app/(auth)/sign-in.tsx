// import React, { useState } from 'react'
// import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
// import { supabase } from '../../lib/supabase'
// import { useRouter } from 'expo-router'
// import BackgroundPage from "@/components/props/peppabg";
// export default function SignInScreen() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   async function signInWithEmail() {
//     setLoading(true)
//     const { error } = await supabase.auth.signInWithPassword({
//       email: email,
//       password: password,
//     })

//     if (error) Alert.alert('Error', error.message)
//     setLoading(false)
//   }

//   return (
//     <BackgroundPage
//       backgroundSource={require('../../assets/images/bg/login.png')}

//     >
//     <KeyboardAvoidingView 
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <View style={styles.content}>
//         <Text style={styles.title}>Welcome Back</Text>
//         <Text style={styles.subtitle}>Sign in to your account</Text>

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             placeholderTextColor="#999"
//             onChangeText={setEmail}
//             value={email}
//             autoCapitalize="none"
//             keyboardType="email-address"
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             placeholderTextColor="#999"
//             onChangeText={setPassword}
//             value={password}
//             secureTextEntry
//             autoCapitalize="none"
//           />
//         </View>

//         <TouchableOpacity
//           style={[styles.button, loading && styles.buttonDisabled]}
//           onPress={signInWithEmail}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>Sign In</Text>
//         </TouchableOpacity>

//         {/* forgot password */}
//         <TouchableOpacity 
//           style={styles.forgotPassword}
//           onPress={() => router.push('/(auth)/forgot-password')}
//         >
//           <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//         </TouchableOpacity>

//         <View style={styles.footer}>
//           <Text style={styles.footerText}>Don't have an account? </Text>
//           <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
//             <Text style={styles.link}>Sign Up</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//      </BackgroundPage>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, 
//   },
//   content: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 32,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   input: {
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//     padding: 16,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#000',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   buttonDisabled: {
//     opacity: 0.5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   forgotPassword: {
//     alignSelf: 'flex-end',
//     marginBottom: 16,
//   },
//   forgotPasswordText: {
//     fontSize: 14,
//     color: '#007AFF',
//     fontWeight: '500',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 24,
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   link: {
//     fontSize: 14,
//     color: '#007AFF',
//     fontWeight: '600',
//   },
// })
import React, { useState } from 'react'
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Platform } from 'react-native'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'expo-router'
import BackgroundPage from "@/components/props/peppabg";

export default function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting sign in with:', email.trim());
      console.log('Starting auth request...');
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000);
      });
      
      // Race between the auth call and timeout
      const authPromise = supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });
      
      const { data, error } = await Promise.race([authPromise, timeoutPromise]) as any;

      console.log('Sign in response received:', { 
        hasSession: !!data?.session, 
        hasUser: !!data?.user,
        error: error?.message 
      });

      if (error) {
        console.error('Supabase auth error:', error);
        Alert.alert('Login Failed', error.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        console.log('Session created successfully!');
        console.log('User ID:', data.user?.id);
        console.log('Navigating to tabs...');
        
        // Navigate immediately
        router.replace('/(tabs)');
      } else {
        console.error('No session returned despite no error');
        Alert.alert('Error', 'Login succeeded but no session was created');
        setLoading(false);
      }
      
    } catch (err: any) {
      console.error('Sign in exception:', err);
      Alert.alert('Unexpected Error', err?.message || 'Something went wrong during sign in.');
      setLoading(false);
    }
  }

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password')
  }

  return (
    <BackgroundPage
      backgroundSource={require('../../assets/images/bg/login.png')}
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
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="jhonpaul@gmail.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="**********"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.signInButton, loading && styles.signInButtonDisabled]}
              onPress={signInWithEmail}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')} disabled={loading}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </BackgroundPage>
  )
}

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
    paddingHorizontal: 24,
  },
  formContainer: {
    flex: 1,
    marginTop: 70,
    justifyContent: "center",
  },
  inputGroup: {
    marginBottom: 28,
  },
  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  forgotPassword: {
    color: "#FFFFFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 18,
    fontSize: 16,
    color: "#333",
  },
  signInButton: {
    backgroundColor: "#F492B5",
    borderRadius: 35,
    paddingVertical: 20,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingBottom: 40,
  },
  signUpText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  signUpLink: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
})