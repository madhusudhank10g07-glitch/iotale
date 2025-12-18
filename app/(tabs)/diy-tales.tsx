// // screens/DiyTalesScreen.tsx
// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   LinearGradient,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';

// const { width, height } = Dimensions.get('window');

// const DiyTalesScreen = () => {
//   const router = useRouter();

//   const handleBack = () => {
//     router.back();
//   };

//   const handleBeginRecording = () => {
//     // Navigate to recording screen
//     router.push('/recording');
//   };

//   const handleViewTales = () => {
//     // Navigate to tales list
//     router.push('/tales-list');
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView 
//         style={styles.scrollContent} 
//         contentContainerStyle={styles.scrollContentContainer}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//             <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
//             <Text style={styles.backText}>Back</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Main Content */}
//         <View style={styles.mainContent}>
//           <Text style={styles.mainTitle}>DIY Tales</Text>
          
//           <Text style={styles.subtitle}>Create Your Own Tales</Text>
          
//           <View style={styles.infoCard}>
//             <Ionicons name="information-circle" size={24} color="#FFD700" />
//             <Text style={styles.tipText}>
//               Ready to record your fairy tale?{'\n'}
//               Tip: Use an expressive voice and introduce pauses for dramatic effect
//             </Text>
//           </View>
          
//           <TouchableOpacity 
//             style={styles.recordButton}
//             onPress={handleBeginRecording}
//             activeOpacity={0.8}
//           >
//             <Ionicons name="mic" size={24} color="#FFFFFF" />
//             <Text style={styles.recordButtonText}>Begin Recording</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.viewTalesButton}
//             onPress={handleViewTales}
//             activeOpacity={0.8}
//           >
//             <Ionicons name="list" size={20} color="#FFFFFF" />
//             <Text style={styles.viewTalesButtonText}>View My Tales</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

     
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#8B5CF6', // Purple gradient base
//   },
//   scrollContent: {
//     flex: 1,
//   },
//   scrollContentContainer: {
//     paddingBottom: 20,
//   },
  
//   // Header
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 50,
//     paddingBottom: 20,
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   backText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//   },

//   // Main Content
//   mainContent: {
//     alignItems: 'center',
//     paddingHorizontal: 30,
//     marginTop: 40,
//   },
//   mainTitle: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   infoCard: {
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 35,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 12,
//   },
//   tipText: {
//     flex: 1,
//     fontSize: 15,
//     color: '#FFFFFF',
//     lineHeight: 22,
//   },
//   recordButton: {
//     backgroundColor: '#22c55e',
//     paddingHorizontal: 45,
//     paddingVertical: 18,
//     borderRadius: 35,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 8,
//     minWidth: width * 0.7,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 10,
//   },
//   recordButtonText: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   viewTalesButton: {
//     marginTop: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     paddingHorizontal: 35,
//     paddingVertical: 14,
//     borderRadius: 30,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   viewTalesButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   // Bottom Navigation
//   bottomNav: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 20,
//     paddingBottom: 10,
//     backgroundColor: 'rgba(139, 92, 246, 0.95)',
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   navItem: {
//     alignItems: 'center',
//   },
//   navIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   navIconActive: {
//     backgroundColor: 'rgba(236, 72, 153, 0.6)',
//   },
//   navLabel: {
//     color: '#fff',
//     fontSize: 12,
//     opacity: 0.7,
//   },
//   navLabelActive: {
//     opacity: 1,
//     fontWeight: '600',
//   },
// });

// export default DiyTalesScreen;

// app/(tabs)/diy-tales.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DiyTalesScreen() {
  const router = useRouter();

  const handleBeginRecording = () => {
    router.push('/recording');
  };

  const handleViewTales = () => {
    router.push('/tales-list');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContent} 
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.mainTitle}>DIY Tales</Text>
          
          <Text style={styles.subtitle}>Create Your Own Tales</Text>
          
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#FFD700" />
            <Text style={styles.tipText}>
              Ready to record your fairy tale?{'\n'}
              Tip: Use an expressive voice and introduce pauses for dramatic effect
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.recordButton}
            onPress={handleBeginRecording}
            activeOpacity={0.8}
          >
            <Ionicons name="mic" size={24} color="#FFFFFF" />
            <Text style={styles.recordButtonText}>Begin Recording</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.viewTalesButton}
            onPress={handleViewTales}
            activeOpacity={0.8}
          >
            <Ionicons name="list" size={20} color="#FFFFFF" />
            <Text style={styles.viewTalesButtonText}>View My Tales</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B5CF6',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  mainContent: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 60,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 35,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  recordButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 45,
    paddingVertical: 18,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    minWidth: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  viewTalesButton: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 35,
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  viewTalesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});