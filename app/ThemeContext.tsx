import * as React from 'react';
import { NAV_THEME } from '../lib/constants';

// ThemeName type definition
export type ThemeName = 'rocksmith' | 'acoustic';

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

// String color definitions (muted for easier viewing)
export const ROCKSMITH_STRING_COLORS = [
  '#CC6666', // E (6th, low) - Muted red
  '#D9C266', // A (5th) - Muted gold
  '#6699CC', // D (4th) - Muted blue
  '#CC9966', // G (3rd) - Muted orange
  '#66CC99', // B (2nd) - Muted teal
  '#B366CC', // E (1st, high) - Muted purple
];

export const ACOUSTIC_STRING_COLORS = [
  '#D4A574', // E (6th, low) - Bronze/Gold (wound string)
  '#C9985A', // A (5th) - Darker Bronze
  '#BF8B40', // D (4th) - Deep Bronze
  '#E8D5B7', // G (3rd) - Light Bronze
  '#F5E6D3', // B (2nd) - Pale Steel
  '#FEFAF2', // E (1st, high) - Bright Steel
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
    fretboardBackground: '#5D4037', // Dark wood brown (ebony/rosewood)
    fretboardBorder: '#3E2723', // Darker wood border
    fretboardNut: '#E8E8E8', // Light bone/ivory nut
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
  acoustic: {
    background: '#F5E6D3', // Warm cream/beige (like spruce top)
    text: '#3E2723', // Dark brown
    textSecondary: '#5D4037', // Medium brown
    button: '#8D6E63', // Wood brown
    buttonText: '#FFFFFF',
    modalBackground: '#FFF8E7', // Light wood color
    fretboardBackground: '#6D4C41', // Rosewood brown
    fretboardBorder: '#4E342E', // Dark rosewood
    fretboardNut: '#F5F5DC', // Bone white
    noteDotOpen: '#FF6B35', // Warm orange (for open strings)
    noteDotOpenBorder: '#8B4513', // Saddle brown border
    noteDotFretted: '#D4A574', // Bronze/gold (like acoustic strings)
    noteDotFrettedBorder: '#8B6914', // Dark gold border
    stringColors: ACOUSTIC_STRING_COLORS,
    fretboardInlayDot: '#FFFAF0', // Pearl white (mother of pearl inlays)
    noteButtonBackground: '#A1887F', // Light wood
    noteButtonBorderColor: '#6D4C41', // Dark wood border
    noteButtonText: '#3E2723', // Dark brown text
    card: '#FFF8E7',
    primary: '#D4A574', // Bronze/gold
    notification: '#FF6B35', // Warm orange
    icon: '#8D6E63',
    shadow: '#3E2723',
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
