

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import BackgroundPage from '@/components/props/peppabg';
export default function DeleteConfirmationScreen() {
  const router = useRouter();

  function handleYes() {
    router.push('/delete-input');
  }

  function handleCancel() {
    router.push('/cancel-delete');
  }

  return (
    <BackgroundPage
      backgroundSource={require('../assets/images/bg/delprofile.png')}

    >
    <View style={styles.container}>
      {/* Back Button - Mapped to handleCancel to fit the style pattern */}
      <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Main Card */}
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>Delete Account?</Text>

        {/* Description */}
        <Text style={styles.description}>
         Are you sure you want to delete your account? You will erase all data and history Linked to that account
        </Text>
      </View>

      {/* Yes Button - Styled like the pink delete button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleYes}
      >
        <Text style={styles.deleteButtonText}>Yes, Delete</Text>
      </TouchableOpacity>

      {/* Cancel Button - Added as a secondary action below */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleCancel}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
    </BackgroundPage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  // Ensure background is white to match the aesthetic
  },
  backButton: {
    marginBottom: 30,
    padding: 10,
    marginTop: 20, // Adjusted for typical SafeArea
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#333', // Dark text since background is white
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1976D2',
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
    marginTop: 80, // Positioned similarly to the source
    marginLeft: 20,
    marginRight: 20,
    elevation: 5, // Added shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelButton: {
     backgroundColor: '#ffffffff',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});