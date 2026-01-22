import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage, languagesList as languages } from '../contexts/LanguageContext';
import BackgroundPage from '@/components/props/peppabg';
import { Image } from "react-native";



const LanguageSelectionPage = () => {
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };


  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );
 

  

  const handleLanguageSelect = async (langCode: string) => {
    await setLanguage(langCode as any);
    Alert.alert(t('success'), t('languageUpdated'));
  };

  const handleNavigation = (tab: string) => {
    console.log(`Navigate to ${tab}`);
  };

  const renderLanguageItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.languageCard,
        { backgroundColor: language === item.code ? '#F492B5' : '#2563EB' },
        language === item.code && styles.selectedCard
      ]}
      onPress={() => handleLanguageSelect(item.code)}
      activeOpacity={0.8}
    >
      <View style={styles.languageContent}>
        <View style={styles.flagContainer}>
          <Text style={styles.flagEmoji}>{item.flag || '🌐'}</Text>
        </View>
        <View style={styles.languageTextContainer}>
          <Text style={styles.languageName}>{item.nativeName}</Text>
          <Text style={styles.languageSubtitle}>{item.name}</Text>
        </View>
      </View>
      {language === item.code && (
        <View style={styles.checkmarkContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
        <BackgroundPage
      backgroundSource={require('../assets/images/bg/diybg.png')}

    >



    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>{t('chooseLanguage')}</Text>
        <Text style={styles.subtitle}>Choose your language</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchLanguage')}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Language Options with FlatList */}
      <FlatList
        data={filteredLanguages}
        keyExtractor={(item) => item.code}
        renderItem={renderLanguageItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={styles.flatList}
      />

      {/* Bottom Navigation - Fixed */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/profile')}
        >
          <Image
              source={require("@/assets/icons/profico.png")}
              style={{
                width: 28,
                height: 28, 
                resizeMode: 'contain',
              }}
            />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/diy-tales')}
        >
         <Image
              source={require("@/assets/icons/mytales.png")}
              style={{
                width: 28,
                height: 28, 
                resizeMode: 'contain',
              }}
            />
          <Text style={[styles.navLabel, styles.activeNavLabel]}>My Tales</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/diy-tales')}
        >
          <Image
              source={require("@/assets/icons/diytales.png")}
              style={{
                width: 28,
                height: 28, 
                resizeMode: 'contain',
              }}
            />
                      <Text style={[styles.navLabel, styles.activeNavLabel]}>diy Tales</Text>

        </TouchableOpacity>
      </View>
    </View>
        </BackgroundPage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    paddingTop: StatusBar.currentHeight || 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 10,
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    marginRight: 6,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 26,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#0d5a9d",
  },
  listContent: {
    paddingBottom: 120,
    gap: 16,
  },
  languageCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    minHeight: 85,
    marginBottom: 16,
    backgroundColor:"#0d5a9d",
  },
  selectedCard: {
    backgroundColor: '#F492B5',
    shadowColor: '#F492B5',
    shadowOpacity: 0.4,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  flagEmoji: {
    fontSize: 28,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  languageSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
  checkmarkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkmark: {
    color: '#F492B5',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#0d5a9d",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,

  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    width: 38,
    height: 38,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  activeNavIcon: {
    backgroundColor: '#F492B5',
    shadowColor: '#F492B5',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  navIconText: {
    fontSize: 24,
  },
  navLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.8,
  },
  activeNavLabel: {
    opacity: 1,
    fontWeight: '600',
  },
});

export default LanguageSelectionPage;