// app/language-select.tsx
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useLanguage, languagesList as languages } from '../contexts/LanguageContext'

export default function LanguageSelectScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  async function handleLanguageSelect(langCode: string) {
    await setLanguage(langCode as any)
    Alert.alert(t('success'), t('languageUpdated'))
    router.back()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('chooseLanguage')}</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder={t('searchLanguage')}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FlatList
        data={filteredLanguages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.languageItem,
              language === item.code && styles.selectedLanguage
            ]}
            onPress={() => handleLanguageSelect(item.code)}
          >
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{item.nativeName}</Text>
              <Text style={styles.languageEnglishName}>{item.name}</Text>
            </View>
            {language === item.code && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchInput: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedLanguage: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  languageEnglishName: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    fontSize: 24,
    color: '#2196F3',
    fontWeight: 'bold',
  },
})