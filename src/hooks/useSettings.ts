import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  isDark: boolean;
  showNumbering: boolean;
  zoom: number;
  showDayOfWeek: boolean;
  showYear: boolean;
  setDark: (isDark: boolean) => void;
  setShowNumbering: (show: boolean) => void;
  setZoom: (zoom: number) => void;
  setShowDayOfWeek: (show: boolean) => void;
  setShowYear: (show: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
      showNumbering: false,
      zoom: 1,
      showDayOfWeek: false,
      showYear: false,
      setDark: (isDark) => {
        set({ isDark });
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      setShowNumbering: (showNumbering) => set({ showNumbering }),
      setZoom: (zoom) => {
        set({ zoom });
        document.documentElement.style.setProperty('--app-zoom', zoom.toString());
        const mainContent = document.querySelector('main');
        if (mainContent) {
          mainContent.style.transform = `scale(${zoom})`;
          mainContent.style.transformOrigin = 'top center';
          // Adjust container size to prevent scrollbar issues
          mainContent.style.width = `${100 / zoom}%`;
          mainContent.style.maxWidth = `${1200 / zoom}px`; // Maintain max-width
          mainContent.style.margin = '0 auto';
        }
      },
      setShowDayOfWeek: (showDayOfWeek) => set({ showDayOfWeek }),
      setShowYear: (showYear) => set({ showYear }),
    }),
    {
      name: 'app-settings',
    }
  )
);