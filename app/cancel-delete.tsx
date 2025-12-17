 
import BackgroundPage from '@/components/props/peppabg'
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation ,useRouter } from 'expo-router';
export default function CancelDeleteScreen() {
  const navigate = useNavigation();
  const [deleteInput, setDeleteInput] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter()
 

  const handleConfirmDelete = () => {
    setShowConfirmModal(false);
    Alert.alert('Success', 'Account deleted successfully');
    setDeleteInput('');
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleBack = () => {
    navigate.goBack();
  };
  const handleprofile = () =>{
    router.push('/profile')
  }

  return (
    <BackgroundPage
      backgroundSource={require('../assets/images/bg/delprofthank.png')}

    > 
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Main Card */}
      <View style={styles.card}>
       

        {/* Title */}
        <Text style={styles.title}>Thanks for
changing your mind</Text>

        {/* Description */}
        <Text style={styles.description}>
          Your all data is preserved you can continue your journey
        </Text>

        {/* Input Field */}
       
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        style={[
          styles.deleteButton, 
        ]}
        onPress={handleprofile}
         
      >
        <Text style={styles.deleteButtonText}>Go back to Home Screen</Text>
      </TouchableOpacity>

       
    </View>
    </BackgroundPage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
  },
  backButton: {
    marginBottom: 30,
    padding:10, 
    marginTop: 20,
    marginLeft:20
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1976D2',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    position: 'relative',
    marginTop:110,
    marginLeft:20,
    marginRight:20
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '400',
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
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#20ca17ff',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
   
    marginLeft:20,
    marginRight:20
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
   
});