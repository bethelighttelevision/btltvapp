import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '../types';
import { supabase } from './supabase';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setGuest: (isGuest: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isGuest: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, isGuest: false }),
  setProfile: (profile) => set({ profile }),
  setGuest: (isGuest) => set({ isGuest, user: null, isAuthenticated: false }),
  logout: () => {
    supabase.auth.signOut();
    set({ user: null, profile: null, isAuthenticated: false, isGuest: false });
  },
}));

interface WatchState {
  continueWatching: { episodeId: string; timestamp: number; showId: string; title: string; thumbnail: string }[];
  watchHistory: { episodeId: string; showId: string; title: string; watchedAt: string }[];
  bookmarks: string[];
  addToContinueWatching: (item: WatchState['continueWatching'][0]) => void;
  addToHistory: (item: WatchState['watchHistory'][0]) => void;
  toggleBookmark: (id: string) => void;
  loadFromStorage: () => Promise<void>;
  clearHistory: () => void;
}

export const useWatchStore = create<WatchState>((set, get) => ({
  continueWatching: [],
  watchHistory: [],
  bookmarks: [],
  addToContinueWatching: (item) => {
    const existing = get().continueWatching.filter(c => c.episodeId !== item.episodeId);
    const updated = [item, ...existing].slice(0, 10);
    set({ continueWatching: updated });
    AsyncStorage.setItem('continueWatching', JSON.stringify(updated));
  },
  addToHistory: (item) => {
    const updated = [item, ...get().watchHistory].slice(0, 200);
    set({ watchHistory: updated });
    AsyncStorage.setItem('watchHistory', JSON.stringify(updated));
  },
  toggleBookmark: (id) => {
    const bookmarks = get().bookmarks;
    const updated = bookmarks.includes(id) ? bookmarks.filter(b => b !== id) : [...bookmarks, id];
    set({ bookmarks: updated });
    AsyncStorage.setItem('bookmarks', JSON.stringify(updated));
  },
  loadFromStorage: async () => {
    try {
      const cw = await AsyncStorage.getItem('continueWatching');
      const wh = await AsyncStorage.getItem('watchHistory');
      const bm = await AsyncStorage.getItem('bookmarks');
      if (cw) set({ continueWatching: JSON.parse(cw) });
      if (wh) set({ watchHistory: JSON.parse(wh) });
      if (bm) set({ bookmarks: JSON.parse(bm) });
    } catch {}
  },
  clearHistory: () => {
    set({ watchHistory: [], continueWatching: [] });
    ['watchHistory', 'continueWatching'].forEach(key => AsyncStorage.removeItem(key));
  },
}));

interface SpotifyAudioState {
  currentTrack: { title: string; url: string; artist?: string } | null;
  isPlaying: boolean;
  setTrack: (track: SpotifyAudioState['currentTrack']) => void;
  setPlaying: (isPlaying: boolean) => void;
}

export const useAudioStore = create<SpotifyAudioState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  setTrack: (track) => set({ currentTrack: track }),
  setPlaying: (isPlaying) => set({ isPlaying }),
}));
