import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'

export default function DeleteInputScreen() {
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (inputText.toLowerCase() !== 'delete') {
      Alert.alert('Error', 'Please type "delete" to confirm')
      return
    }

    setLoading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        Alert.alert('Error', 'No user found')
        setLoading(false)
        return
      }

      // Delete user data from profiles table (if exists)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      // Note: profileError might occur if table doesn't exist yet, which is fine

      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id)
      
      if (authError) {
        // If admin delete doesn't work (requires service role key), 
        // we can use the user's own session to delete
        const { error: userDeleteError } = await supabase.rpc('delete_user')
        
        if (userDeleteError) {
          Alert.alert('Error', 'Failed to delete account. Please contact support.')
          setLoading(false)
          return
        }
      }

      // Sign out
      await supabase.auth.signOut()
      
      // Navigate to success page or login
      router.replace('/')
      Alert.alert('Success', 'Your account has been deleted')
      
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    router.push('/cancel-delete')
  }

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>Final Confirmation</Text>
        <Text style={styles.message}>
          Type <Text style={styles.bold}>delete</Text> to permanently delete your account
        </Text>

        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type 'delete' here"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton, loading && styles.buttonDisabled]}
            onPress={handleDelete}
            disabled={loading}
          >
            <Text style={styles.deleteButtonText}>
              {loading ? 'Deleting...' : 'Delete Forever'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  deleteButton: {
    backgroundColor: '#8B0000',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})