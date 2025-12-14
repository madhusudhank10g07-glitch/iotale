// contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const translations = {
  en: {
    // Profile Screen
    profile: 'Profile',
    email: 'Email',
    userId: 'User ID',
    createdAt: 'Created At',
    signOut: 'Sign Out',
    deleteAccount: 'Delete Account',
    language: 'Language',
    selectLanguage: 'Select Language',
    
    // Delete Flow
    deleteConfirmTitle: 'Delete Account?',
    deleteConfirmMessage: 'Are you sure you want to delete your account? This action cannot be undone.',
    cancel: 'Cancel',
    yesDelete: 'Yes, Delete',
    finalConfirmation: 'Final Confirmation',
    typeDelete: 'Type delete to permanently delete your account',
    typeDeletePlaceholder: "Type 'delete' here",
    deleteForever: 'Delete Forever',
    deleting: 'Deleting...',
    thanksMessage: 'Thanks for Changing Your Mind!',
    thanksSubMessage: "We're glad you're staying with us. Your account is safe and secure.",
    backToProfile: 'Back to Profile',
    
    // Language Selection
    languages: 'Languages',
    searchLanguage: 'Search language...',
    currentLanguage: 'Current Language',
  },
  kn: {
    profile: 'ಪ್ರೊಫೈಲ್',
    email: 'ಇಮೇಲ್',
    userId: 'ಬಳಕೆದಾರ ಐಡಿ',
    createdAt: 'ರಚಿಸಲಾಗಿದೆ',
    signOut: 'ಸೈನ್ ಔಟ್',
    deleteAccount: 'ಖಾತೆಯನ್ನು ಅಳಿಸಿ',
    language: 'ಭಾಷೆ',
    selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    deleteConfirmTitle: 'ಖಾತೆಯನ್ನು ಅಳಿಸುವುದೇ?',
    deleteConfirmMessage: 'ನೀವು ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗುವುದಿಲ್ಲ.',
    cancel: 'ರದ್ದುಮಾಡಿ',
    yesDelete: 'ಹೌದು, ಅಳಿಸಿ',
    finalConfirmation: 'ಅಂತಿಮ ದೃಢೀಕರಣ',
    typeDelete: 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲು ಅಳಿಸಿ ಎಂದು ಟೈಪ್ ಮಾಡಿ',
    typeDeletePlaceholder: "ಇಲ್ಲಿ 'ಅಳಿಸಿ' ಎಂದು ಟೈಪ್ ಮಾಡಿ",
    deleteForever: 'ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಿ',
    deleting: 'ಅಳಿಸಲಾಗುತ್ತಿದೆ...',
    thanksMessage: 'ನಿಮ್ಮ ಮನಸ್ಸು ಬದಲಾಯಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು!',
    thanksSubMessage: 'ನೀವು ನಮ್ಮೊಂದಿಗೆ ಇರುತ್ತಿರುವುದಕ್ಕೆ ನಾವು ಸಂತೋಷಪಡುತ್ತೇವೆ. ನಿಮ್ಮ ಖಾತೆ ಸುರಕ್ಷಿತವಾಗಿದೆ.',
    backToProfile: 'ಪ್ರೊಫೈಲ್‌ಗೆ ಹಿಂತಿರುಗಿ',
    languages: 'ಭಾಷೆಗಳು',
    searchLanguage: 'ಭಾಷೆಯನ್ನು ಹುಡುಕಿ...',
    currentLanguage: 'ಪ್ರಸ್ತುತ ಭಾಷೆ',
  },
  es: {
    // Profile Screen
    profile: 'Perfil',
    email: 'Correo Electrónico',
    userId: 'ID de Usuario',
    createdAt: 'Creado En',
    signOut: 'Cerrar Sesión',
    deleteAccount: 'Eliminar Cuenta',
    language: 'Idioma',
    selectLanguage: 'Seleccionar Idioma',
    
    // Delete Flow
    deleteConfirmTitle: '¿Eliminar Cuenta?',
    deleteConfirmMessage: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
    cancel: 'Cancelar',
    yesDelete: 'Sí, Eliminar',
    finalConfirmation: 'Confirmación Final',
    typeDelete: 'Escribe eliminar para eliminar permanentemente tu cuenta',
    typeDeletePlaceholder: "Escribe 'eliminar' aquí",
    deleteForever: 'Eliminar Para Siempre',
    deleting: 'Eliminando...',
    thanksMessage: '¡Gracias por Cambiar de Opinión!',
    thanksSubMessage: 'Nos alegra que te quedes con nosotros. Tu cuenta está segura.',
    backToProfile: 'Volver al Perfil',
    
    // Language Selection
    languages: 'Idiomas',
    searchLanguage: 'Buscar idioma...',
    currentLanguage: 'Idioma Actual',
  },
  fr: {
    profile: 'Profil',
    email: 'E-mail',
    userId: 'ID Utilisateur',
    createdAt: 'Créé Le',
    signOut: 'Se Déconnecter',
    deleteAccount: 'Supprimer le Compte',
    language: 'Langue',
    selectLanguage: 'Sélectionner la Langue',
    deleteConfirmTitle: 'Supprimer le Compte?',
    deleteConfirmMessage: 'Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible.',
    cancel: 'Annuler',
    yesDelete: 'Oui, Supprimer',
    finalConfirmation: 'Confirmation Finale',
    typeDelete: 'Tapez supprimer pour supprimer définitivement votre compte',
    typeDeletePlaceholder: "Tapez 'supprimer' ici",
    deleteForever: 'Supprimer Définitivement',
    deleting: 'Suppression...',
    thanksMessage: 'Merci d\'Avoir Changé d\'Avis!',
    thanksSubMessage: 'Nous sommes heureux que vous restiez avec nous. Votre compte est en sécurité.',
    backToProfile: 'Retour au Profil',
    languages: 'Langues',
    searchLanguage: 'Rechercher une langue...',
    currentLanguage: 'Langue Actuelle',
  },
  de: {
    profile: 'Profil',
    email: 'E-Mail',
    userId: 'Benutzer-ID',
    createdAt: 'Erstellt Am',
    signOut: 'Abmelden',
    deleteAccount: 'Konto Löschen',
    language: 'Sprache',
    selectLanguage: 'Sprache Auswählen',
    deleteConfirmTitle: 'Konto Löschen?',
    deleteConfirmMessage: 'Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
    cancel: 'Abbrechen',
    yesDelete: 'Ja, Löschen',
    finalConfirmation: 'Endgültige Bestätigung',
    typeDelete: 'Geben Sie löschen ein, um Ihr Konto dauerhaft zu löschen',
    typeDeletePlaceholder: "Geben Sie 'löschen' ein",
    deleteForever: 'Für Immer Löschen',
    deleting: 'Wird Gelöscht...',
    thanksMessage: 'Danke, dass Sie Ihre Meinung Geändert Haben!',
    thanksSubMessage: 'Wir freuen uns, dass Sie bei uns bleiben. Ihr Konto ist sicher.',
    backToProfile: 'Zurück zum Profil',
    languages: 'Sprachen',
    searchLanguage: 'Sprache suchen...',
    currentLanguage: 'Aktuelle Sprache',
  },
  zh: {
    profile: '个人资料',
    email: '电子邮件',
    userId: '用户ID',
    createdAt: '创建于',
    signOut: '退出登录',
    deleteAccount: '删除账户',
    language: '语言',
    selectLanguage: '选择语言',
    deleteConfirmTitle: '删除账户？',
    deleteConfirmMessage: '您确定要删除您的账户吗？此操作无法撤消。',
    cancel: '取消',
    yesDelete: '是的，删除',
    finalConfirmation: '最终确认',
    typeDelete: '输入删除以永久删除您的账户',
    typeDeletePlaceholder: "在此输入'删除'",
    deleteForever: '永久删除',
    deleting: '删除中...',
    thanksMessage: '感谢您改变主意！',
    thanksSubMessage: '我们很高兴您留下来。您的账户是安全的。',
    backToProfile: '返回个人资料',
    languages: '语言',
    searchLanguage: '搜索语言...',
    currentLanguage: '当前语言',
  },
  ja: {
    profile: 'プロフィール',
    email: 'メール',
    userId: 'ユーザーID',
    createdAt: '作成日',
    signOut: 'サインアウト',
    deleteAccount: 'アカウント削除',
    language: '言語',
    selectLanguage: '言語を選択',
    deleteConfirmTitle: 'アカウントを削除？',
    deleteConfirmMessage: 'アカウントを削除してもよろしいですか？この操作は元に戻せません。',
    cancel: 'キャンセル',
    yesDelete: 'はい、削除',
    finalConfirmation: '最終確認',
    typeDelete: 'アカウントを完全に削除するには削除と入力してください',
    typeDeletePlaceholder: "ここに'削除'と入力",
    deleteForever: '完全に削除',
    deleting: '削除中...',
    thanksMessage: '考え直していただきありがとうございます！',
    thanksSubMessage: 'お客様が引き続きご利用いただけることを嬉しく思います。アカウントは安全です。',
    backToProfile: 'プロフィールに戻る',
    languages: '言語',
    searchLanguage: '言語を検索...',
    currentLanguage: '現在の言語',
  },
  hi: {
    profile: 'प्रोफ़ाइल',
    email: 'ईमेल',
    userId: 'उपयोगकर्ता आईडी',
    createdAt: 'बनाया गया',
    signOut: 'साइन आउट',
    deleteAccount: 'खाता हटाएं',
    language: 'भाषा',
    selectLanguage: 'भाषा चुनें',
    deleteConfirmTitle: 'खाता हटाएं?',
    deleteConfirmMessage: 'क्या आप वाकई अपना खाता हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
    cancel: 'रद्द करें',
    yesDelete: 'हां, हटाएं',
    finalConfirmation: 'अंतिम पुष्टि',
    typeDelete: 'अपना खाता स्थायी रूप से हटाने के लिए हटाएं टाइप करें',
    typeDeletePlaceholder: "यहां 'हटाएं' टाइप करें",
    deleteForever: 'हमेशा के लिए हटाएं',
    deleting: 'हटाया जा रहा है...',
    thanksMessage: 'अपना विचार बदलने के लिए धन्यवाद!',
    thanksSubMessage: 'हमें खुशी है कि आप हमारे साथ बने हुए हैं। आपका खाता सुरक्षित है।',
    backToProfile: 'प्रोफ़ाइल पर वापस जाएं',
    languages: 'भाषाएं',
    searchLanguage: 'भाषा खोजें...',
    currentLanguage: 'वर्तमान भाषा',
  },
  ar: {
    profile: 'الملف الشخصي',
    email: 'البريد الإلكتروني',
    userId: 'معرف المستخدم',
    createdAt: 'تم الإنشاء في',
    signOut: 'تسجيل الخروج',
    deleteAccount: 'حذف الحساب',
    language: 'اللغة',
    selectLanguage: 'اختر اللغة',
    deleteConfirmTitle: 'حذف الحساب؟',
    deleteConfirmMessage: 'هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.',
    cancel: 'إلغاء',
    yesDelete: 'نعم، احذف',
    finalConfirmation: 'التأكيد النهائي',
    typeDelete: 'اكتب حذف لحذف حسابك نهائيًا',
    typeDeletePlaceholder: "اكتب 'حذف' هنا",
    deleteForever: 'احذف للأبد',
    deleting: 'جاري الحذف...',
    thanksMessage: 'شكرًا لتغيير رأيك!',
    thanksSubMessage: 'يسعدنا أنك تبقى معنا. حسابك آمن.',
    backToProfile: 'العودة إلى الملف الشخصي',
    languages: 'اللغات',
    searchLanguage: 'ابحث عن لغة...',
    currentLanguage: 'اللغة الحالية',
  },
  pt: {
    profile: 'Perfil',
    email: 'E-mail',
    userId: 'ID do Usuário',
    createdAt: 'Criado Em',
    signOut: 'Sair',
    deleteAccount: 'Excluir Conta',
    language: 'Idioma',
    selectLanguage: 'Selecionar Idioma',
    deleteConfirmTitle: 'Excluir Conta?',
    deleteConfirmMessage: 'Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.',
    cancel: 'Cancelar',
    yesDelete: 'Sim, Excluir',
    finalConfirmation: 'Confirmação Final',
    typeDelete: 'Digite excluir para excluir permanentemente sua conta',
    typeDeletePlaceholder: "Digite 'excluir' aqui",
    deleteForever: 'Excluir Para Sempre',
    deleting: 'Excluindo...',
    thanksMessage: 'Obrigado por Mudar de Ideia!',
    thanksSubMessage: 'Estamos felizes que você está ficando conosco. Sua conta está segura.',
    backToProfile: 'Voltar ao Perfil',
    languages: 'Idiomas',
    searchLanguage: 'Pesquisar idioma...',
    currentLanguage: 'Idioma Atual',
  },
  ru: {
    profile: 'Профиль',
    email: 'Электронная Почта',
    userId: 'ID Пользователя',
    createdAt: 'Создано',
    signOut: 'Выйти',
    deleteAccount: 'Удалить Аккаунт',
    language: 'Язык',
    selectLanguage: 'Выбрать Язык',
    deleteConfirmTitle: 'Удалить Аккаунт?',
    deleteConfirmMessage: 'Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.',
    cancel: 'Отмена',
    yesDelete: 'Да, Удалить',
    finalConfirmation: 'Окончательное Подтверждение',
    typeDelete: 'Введите удалить, чтобы навсегда удалить свой аккаунт',
    typeDeletePlaceholder: "Введите 'удалить' здесь",
    deleteForever: 'Удалить Навсегда',
    deleting: 'Удаление...',
    thanksMessage: 'Спасибо, что Передумали!',
    thanksSubMessage: 'Мы рады, что вы остаетесь с нами. Ваш аккаунт в безопасности.',
    backToProfile: 'Вернуться к Профилю',
    languages: 'Языки',
    searchLanguage: 'Поиск языка...',
    currentLanguage: 'Текущий Язык',
  },
  
  te: {
    profile: 'ప్రొఫైల్',
    email: 'ఇమెయిల్',
    userId: 'వినియోగదారు ఐడి',
    createdAt: 'సృష్టించబడింది',
    signOut: 'సైన్ అవుట్',
    deleteAccount: 'ఖాతాను తొలగించండి',
    language: 'భాష',
    selectLanguage: 'భాషను ఎంచుకోండి',
    deleteConfirmTitle: 'ఖాతాను తొలగించాలా?',
    deleteConfirmMessage: 'మీరు మీ ఖాతాను తొలగించాలనుకుంటున్నారా? ఈ చర్య రద్దు చేయబడదు.',
    cancel: 'రద్దు చేయండి',
    yesDelete: 'అవును, తొలగించండి',
    finalConfirmation: 'చివరి నిర్ధారణ',
    typeDelete: 'మీ ఖాతాను శాశ్వతంగా తొలగించడానికి తొలగించండి అని టైప్ చేయండి',
    typeDeletePlaceholder: "ఇక్కడ 'తొలగించండి' అని టైప్ చేయండి",
    deleteForever: 'శాశ్వతంగా తొలగించండి',
    deleting: 'తొలగిస్తోంది...',
    thanksMessage: 'మీ మనసు మార్చుకున్నందుకు ధన్యవాదాలు!',
    thanksSubMessage: 'మీరు మాతో ఉంటున్నందుకు మేము సంతోషిస్తున్నాము. మీ ఖాతా సురక్షితంగా ఉంది.',
    backToProfile: 'ప్రొఫైల్‌కు తిరిగి వెళ్ళండి',
    languages: 'భాషలు',
    searchLanguage: 'భాషను వెతకండి...',
    currentLanguage: 'ప్రస్తుత భాష',
  },
  ta: {
    profile: 'சுயவிவரம்',
    email: 'மின்னஞ்சல்',
    userId: 'பயனர் ஐடி',
    createdAt: 'உருவாக்கப்பட்டது',
    signOut: 'வெளியேறு',
    deleteAccount: 'கணக்கை நீக்கு',
    language: 'மொழி',
    selectLanguage: 'மொழியைத் தேர்ந்தெடு',
    deleteConfirmTitle: 'கணக்கை நீக்கவா?',
    deleteConfirmMessage: 'உங்கள் கணக்கை நீக்க விரும்புகிறீர்களா? இந்த செயலை மாற்ற முடியாது.',
    cancel: 'ரத்துசெய்',
    yesDelete: 'ஆம், நீக்கு',
    finalConfirmation: 'இறுதி உறுதிப்படுத்தல்',
    typeDelete: 'உங்கள் கணக்கை நிரந்தரமாக நீக்க நீக்கு என தட்டச்சு செய்யவும்',
    typeDeletePlaceholder: "இங்கே 'நீக்கு' என தட்டச்சு செய்யவும்",
    deleteForever: 'நிரந்தரமாக நீக்கு',
    deleting: 'நீக்குகிறது...',
    thanksMessage: 'உங்கள் மனதை மாற்றியதற்கு நன்றி!',
    thanksSubMessage: 'நீங்கள் எங்களுடன் தங்கியிருப்பதில் மகிழ்ச்சியடைகிறோம். உங்கள் கணக்கு பாதுகாப்பாக உள்ளது.',
    backToProfile: 'சுயவிவரத்திற்குத் திரும்பு',
    languages: 'மொழிகள்',
    searchLanguage: 'மொழியைத் தேடு...',
    currentLanguage: 'தற்போதைய மொழி',
  },
  ml: {
    profile: 'പ്രൊഫൈൽ',
    email: 'ഇമെയിൽ',
    userId: 'ഉപയോക്തൃ ഐഡി',
    createdAt: 'സൃഷ്ടിച്ചത്',
    signOut: 'സൈൻ ഔട്ട്',
    deleteAccount: 'അക്കൗണ്ട് ഇല്ലാതാക്കുക',
    language: 'ഭാഷ',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    deleteConfirmTitle: 'അക്കൗണ്ട് ഇല്ലാതാക്കണോ?',
    deleteConfirmMessage: 'നിങ്ങളുടെ അക്കൗണ്ട് ഇല്ലാതാക്കാൻ നിങ്ങൾ ആഗ്രഹിക്കുന്നുണ്ടോ? ഈ പ്രവർത്തനം പഴയപടിയാക്കാനാവില്ല.',
    cancel: 'റദ്ദാക്കുക',
    yesDelete: 'അതെ, ഇല്ലാതാക്കുക',
    finalConfirmation: 'അന്തിമ സ്ഥിരീകരണം',
    typeDelete: 'നിങ്ങളുടെ അക്കൗണ്ട് സ്ഥിരമായി ഇല്ലാതാക്കാൻ ഇല്ലാതാക്കുക എന്ന് ടൈപ്പ് ചെയ്യുക',
    typeDeletePlaceholder: "ഇവിടെ 'ഇല്ലാതാക്കുക' എന്ന് ടൈപ്പ് ചെയ്യുക",
    deleteForever: 'എന്നേക്കുമായി ഇല്ലാതാക്കുക',
    deleting: 'ഇല്ലാതാക്കുന്നു...',
    thanksMessage: 'മനസ്സ് മാറ്റിയതിന് നന്ദി!',
    thanksSubMessage: 'നിങ്ങൾ ഞങ്ങളോടൊപ്പം തുടരുന്നതിൽ സന്തോഷമുണ്ട്. നിങ്ങളുടെ അക്കൗണ്ട് സുരക്ഷിതമാണ്.',
    backToProfile: 'പ്രൊഫൈലിലേക്ക് മടങ്ങുക',
    languages: 'ഭാഷകൾ',
    searchLanguage: 'ഭാഷ തിരയുക...',
    currentLanguage: 'നിലവിലെ ഭാഷ',
  },
}

export const languagesList = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'kn', name: 'Kannada', nativeName: 'Kannada' },
  { code: 'te', name: 'Telugu', nativeName: 'Telugu' },
  { code: 'ta', name: 'Tamil', nativeName: 'Tamil' },
  { code: 'ml', name: 'Malayalam', nativeName: 'Malayalam' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
]

type LanguageContextType = {
  language: keyof typeof translations
  setLanguage: (lang: keyof typeof translations) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<keyof typeof translations>('en')

  useEffect(() => {
    loadLanguage()
  }, [])

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language')
      if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
        setLanguageState(savedLanguage as keyof typeof translations)
      }
    } catch (error) {
      console.error('Error loading language:', error)
    }
  }

  const setLanguage = async (lang: keyof typeof translations) => {
    try {
      await AsyncStorage.setItem('app_language', lang)
      setLanguageState(lang)
    } catch (error) {
      console.error('Error saving language:', error)
    }
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}