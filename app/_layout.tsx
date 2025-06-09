import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import { FontAwesome5 } from '@expo/vector-icons';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { AppThemeProvider, ThemeContext, ThemeName, ThemePalette, THEME_PALETTES } from './ThemeContext';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

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
const SUNSET_GLOW_THEME: Theme = {
  ...DefaultTheme,
  colors: {
    background: '#FFF8E1', // Pale Yellow Cream
    text: '#5D4037', // Dark Brown
    card: '#FFFDE7', // Very Pale Yellow
    border: '#A1887F', // Brownish Grey
    primary: '#FF7043', // Coral
    notification: '#FF5252', // Bright Red
  }
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ...FontAwesome5.font,
  });
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setAndroidNavigationBar(colorScheme);
    // Font loading check can also be here or tied to fontsLoaded state
    // For simplicity, we'll rely on the !fontsLoaded check before rendering
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded || (!fontsLoaded && !fontError)) {
    return null;
  }

  return (
    <AppThemeProvider>
      <ThemeProvider value={ROCKSMITH_THEME}>
        <StatusBar style={'light'} />
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
    </AppThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
