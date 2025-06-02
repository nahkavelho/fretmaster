import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';

// Theme context määrittely
export const ThemeContext = React.createContext<{
  theme: 'light' | 'dark' | 'rocksmith',
  setTheme: (theme: 'light' | 'dark' | 'rocksmith') => void
}>({ theme: 'light', setTheme: () => {} });

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

// Rocksmith-inspired theme
export const ROCKSMITH_STRING_COLORS = [
  '#FF4B4B', // E (6th, low)
  '#FFD900', // A (5th)
  '#00A2FF', // D (4th)
  '#FF9900', // G (3rd)
  '#00E676', // B (2nd)
  '#C74BFF', // E (1st, high)
];
const ROCKSMITH_THEME: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#181A1B',
    card: '#232526',
    border: '#444',
    text: '#FFF',
    primary: '#FF4B4B',
    notification: '#FFD900',
  }
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  // Theme state ylös tänne
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'rocksmith'>('light');

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  const themeObj = theme === 'dark' ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider value={themeObj}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen
            name='index'
            options={{
              title: 'Starter Base',
              headerRight: undefined,
              headerShown: false,
            }}
          />
        </Stack>
        <PortalHost />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
