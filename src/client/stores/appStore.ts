import { create } from 'zustand'

interface AppState {
  currentSubTab: 'today' | 'month' | 'year'
  setSubTab: (tab: 'today' | 'month' | 'year') => void

  galleryColumns: 3 | 6 | 9
  setGalleryColumns: (cols: 3 | 6 | 9) => void

  recallSettings: { polaroid: boolean; showText: boolean; showScore: boolean }
  toggleRecallSetting: (key: 'polaroid' | 'showText' | 'showScore') => void
}

export const useAppStore = create<AppState>((set) => ({
  currentSubTab: 'today',
  setSubTab: (tab) => set({ currentSubTab: tab }),

  galleryColumns: 3,
  setGalleryColumns: (cols) => set({ galleryColumns: cols }),

  recallSettings: { polaroid: true, showText: false, showScore: false },
  toggleRecallSetting: (key) =>
    set((s) => ({
      recallSettings: { ...s.recallSettings, [key]: !s.recallSettings[key] },
    })),
}))
