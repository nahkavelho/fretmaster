import * as React from 'react';
import { NAV_THEME } from '../lib/constants';

// ThemeName type definition
export type ThemeName = 'rocksmith' | 'sunsetGlow' | 'oceanDeep';

// ThemePalette interface definition
export interface ThemePalette {
  background: string;
  text: string;
  textSecondary: string;
  button: string;
  buttonText: string;
  modalBackground: string;
  fretboardBackground: string;
  fretboardBorder: string;
  fretboardNut: string;
  noteDotOpen: string;
  noteDotOpenBorder: string;
  noteDotFretted: string;
  noteDotFrettedBorder: string;
  stringColors: string[];
  fretboardInlayDot: string;
  noteButtonBackground: string;
  noteButtonBorderColor: string;
  noteButtonText: string;
  card: string;
  primary: string;
  notification: string;
  icon: string;
  shadow: string;
}

// String color definitions
export const ROCKSMITH_STRING_COLORS = [
  '#FF4B4B', // E (6th, low)
  '#FFD900', // A (5th)
  '#00A2FF', // D (4th)
  '#FF9900', // G (3rd)
  '#00E676', // B (2nd)
  '#C74BFF', // E (1st, high)
];
export const SUNSET_GLOW_STRING_COLORS = ['#FF6B6B', '#FF9F43', '#FFD166', '#F7B7A3', '#A0E7E5', '#EF476F']; // Low E to High E

export const OCEAN_DEEP_STRING_COLORS = [
  '#00796B', // Low E (6th) - Deep Teal
  '#1976D2', // A (5th) - Medium Blue
  '#4DB6AC', // D (4th) - Lighter Teal
  '#FFF59D', // G (3rd) - Sandy Beige/Light Gold
  '#4DD0E1', // B (2nd) - Aqua Blue
  '#FFAB91', // High E (1st) - Light Coral/Pink
];

// THEME_PALETTES definition using NAV_THEME from ../lib/constants

export const THEME_PALETTES: Record<ThemeName, ThemePalette> = {

  rocksmith: {
    background: '#181A1B',
    text: '#E0E0E0',
    textSecondary: '#A0A0A0',
    button: '#404040', // Darker button background
    buttonText: '#FFF',
    modalBackground: '#232526',
    fretboardBackground: '#181A1B',
    fretboardBorder: '#444',
    fretboardNut: '#303030',
    noteDotOpen: '#FF0000',
    noteDotOpenBorder: '#B71C1C',
    noteDotFretted: '#FFFF00',
    noteDotFrettedBorder: '#F57F17',
    stringColors: ROCKSMITH_STRING_COLORS,
    fretboardInlayDot: '#BDBDBD', // Light Grey
    noteButtonBackground: '#222222', // Very dark grey/near black for Rocksmith note buttons
    noteButtonBorderColor: '#FFD900', // Yellow border for Rocksmith note buttons
    noteButtonText: '#FFF',       // White text for Rocksmith buttons
    card: '#232526',
    primary: '#FFD900',      // Yellow (was Red)
    notification: '#FF4B4B', // Red (was Yellow)
    icon: '#FFD900',
    shadow: '#000000',
  },
  sunsetGlow: {
    background: '#FFF8E1',
    text: '#5D4037',
    textSecondary: '#8D6E63',
    button: '#FF7043',
    buttonText: '#FFFFFF',
    modalBackground: '#FFFDE7',
    fretboardBackground: '#A0522D', // Sienna (Wooden color)
    fretboardBorder: '#A1887F',
    fretboardNut: '#A1887F',
    noteDotOpen: '#FF5252', // Reddish for open strings
    noteDotOpenBorder: '#FFFFFF', // White border for open strings
    noteDotFretted: '#4CAF50', // Vibrant Green for fretted notes
    noteDotFrettedBorder: '#FFFFFF', // White border for fretted notes
    stringColors: SUNSET_GLOW_STRING_COLORS,
    fretboardInlayDot: '#FFF8E1', // Pale Yellow Cream
    noteButtonBackground: '#FF8A65', // Light Coral for Sunset Glow buttons
    noteButtonBorderColor: '#FFAB91', // Lighter Coral border
    noteButtonText: '#FFFFFF',      // White text
    card: '#FFFDE7',
    primary: '#FF7043',
    notification: '#FF5252',
    icon: '#FF7043',
    shadow: '#BF360C',
  },
  oceanDeep: {
    background: '#004D40',
    text: '#E0F7FA',
    textSecondary: '#B2EBF2',
    button: '#0288D1',
    buttonText: '#FFFFFF',
    modalBackground: '#006064',
    fretboardBackground: '#263238',
    fretboardBorder: '#455A64',
    fretboardNut: '#546E7A',
    noteDotOpen: '#FF8A65',
    noteDotOpenBorder: '#FFFFFF',
    noteDotFretted: '#69F0AE',
    noteDotFrettedBorder: '#FFFFFF',
    stringColors: OCEAN_DEEP_STRING_COLORS,
    fretboardInlayDot: '#B2EBF2', // Light Cyan
    noteButtonBackground: '#01579B',
    noteButtonBorderColor: '#0277BD',
    noteButtonText: '#E1F5FE',
    card: '#006064',
    primary: '#4FC3F7',
    notification: '#FFD180',
    icon: '#4FC3F7',
    shadow: '#000000',
  }
};

// ThemeContext definition
export const ThemeContext = React.createContext<{
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  palette: ThemePalette;
}> ({
  themeName: 'rocksmith', // Default theme name
  setThemeName: () => { console.warn('setThemeName called without a ThemeProvider'); },
  palette: THEME_PALETTES.rocksmith, // Default palette
});

// AppThemeProvider component
export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = React.useState<ThemeName>('rocksmith');
  const palette = THEME_PALETTES[themeName];

  // Potentially load saved theme preference here
  // React.useEffect(() => {
  //   // Load theme from AsyncStorage or other storage
  // }, []);

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName, palette }}>
      {children}
    </ThemeContext.Provider>
  );
};
