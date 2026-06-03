import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@btltv_settings';

type LangCode = 'en' | 'nl' | 'ur';

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    home: 'Home', shows: 'Shows', live: 'Live', school: 'School', profile: 'Profile',
    all_shows: 'All Shows', search: 'Search', trending_now: 'Trending Now',
    continue_watching: 'Continue Watching', see_all: 'See All', episodes: 'episodes',
    watch_now: 'Watch now', now_playing: 'Now Playing', live_stream: 'BTL TV Live Stream',
    program_schedule: 'Program Schedule', watch_on_youtube: 'Watch on YouTube',
    like: 'Like', subscribe: 'Subscribe', share: 'Share', save: 'Save',
    settings: 'Settings', language: 'Language', video_quality: 'Video Quality',
    version: 'Version', about: 'About', donate: 'Donate', bookmarks: 'Bookmarks',
    watch_history: 'Watch History', notifications: 'Notifications', sign_in: 'Sign In',
    sign_out: 'Sign Out', guest: 'Guest', video_not_available: 'Video not available',
    live_now: 'LIVE', offline: 'OFFLINE', no_episodes: 'No episodes available',
  },
  nl: {
    home: 'Home', shows: 'Programma', live: 'Live', school: 'School', profile: 'Profiel',
    all_shows: 'Alle Programma', search: 'Zoeken', trending_now: 'Trending Nu',
    continue_watching: 'Verder Kijken', see_all: 'Alles Bekijken', episodes: 'afleveringen',
    watch_now: 'Kijk nu', now_playing: 'Nu Speelt', live_stream: 'BTL TV Live Stream',
    program_schedule: 'Programmaschema', watch_on_youtube: 'Bekijk op YouTube',
    like: 'Vind ik leuk', subscribe: 'Abonneren', share: 'Delen', save: 'Opslaan',
    settings: 'Instellingen', language: 'Taal', video_quality: 'Videokwaliteit',
    version: 'Versie', about: 'Over ons', donate: 'Doneren', bookmarks: 'Bladwijzers',
    watch_history: 'Kijkgeschiedenis', notifications: 'Meldingen', sign_in: 'Inloggen',
    sign_out: 'Uitloggen', guest: 'Gast', video_not_available: 'Video niet beschikbaar',
    live_now: 'LIVE', offline: 'OFFLINE', no_episodes: 'Geen afleveringen beschikbaar',
  },
  ur: {
    home: 'ہوم', shows: 'شوز', live: 'لائیو', school: 'اسکول', profile: 'پروفائل',
    all_shows: 'تمام شوز', search: 'تلاش', trending_now: 'ٹرینڈنگ',
    continue_watching: 'دیکھتے رہیں', see_all: 'سب دیکھیں', episodes: 'اقساط',
    watch_now: 'اب دیکھیں', now_playing: 'اب چل رہا ہے', live_stream: 'BTL TV لائیو سٹریم',
    program_schedule: 'پروگرام شیڈول', watch_on_youtube: 'YouTube پر دیکھیں',
    like: 'پسند', subscribe: 'سبسکرائب', share: 'شیئر', save: 'محفوظ',
    settings: 'سیٹنگز', language: 'زبان', video_quality: 'ویڈیو کوالٹی',
    version: 'ورژن', about: 'تعارف', donate: 'عطیہ', bookmarks: 'بک مارکس',
    watch_history: 'دیکھنے کی ہسٹری', notifications: 'اطلاعات', sign_in: 'سائن ان',
    sign_out: 'سائن آؤٹ', guest: 'مہمان', video_not_available: 'ویڈیو دستیاب نہیں',
    live_now: 'لائیو', offline: 'آف لائن', no_episodes: 'کوئی اقساط نہیں',
  },
};

const langMap: Record<string, LangCode> = {
  English: 'en', Dutch: 'nl', Urdu: 'ur',
};

interface I18nContextType {
  t: (key: string) => string;
  currentLang: string;
  setLang: (lang: string) => Promise<void>;
}

const I18nContext = createContext<I18nContextType>({
  t: (k) => k,
  currentLang: 'English',
  setLang: async () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState('English');

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then(val => {
      if (val) {
        const s = JSON.parse(val);
        if (s.language) setCurrentLang(s.language);
      }
    });
  }, []);

  const setLang = useCallback(async (lang: string) => {
    setCurrentLang(lang);
    const existing = await AsyncStorage.getItem(SETTINGS_KEY);
    const s = existing ? JSON.parse(existing) : {};
    s.language = lang;
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }, []);

  const code = langMap[currentLang] || 'en';
  const t = useCallback((key: string): string => {
    return translations[code]?.[key] || translations['en']?.[key] || key;
  }, [code]);

  return (
    <I18nContext.Provider value={{ t, currentLang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
