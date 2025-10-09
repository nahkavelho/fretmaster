import React from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, Switch, StatusBar, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from "../../components/ui/button";
import { Picker } from '@react-native-picker/picker';

import { ThemeContext, THEME_PALETTES, ThemeName, ThemePalette } from '../ThemeContext';

interface SettingsProps {
  onBack: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (value: boolean) => void;
}

const styles = (palette: ThemePalette, themeName: ThemeName) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  title: {
    color: themeName === 'rocksmith' ? palette.primary : palette.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: palette.modalBackground, // Or a more specific color like card
    borderRadius: 8,
    borderWidth: themeName === 'rocksmith' ? 2 : 0,
    borderColor: themeName === 'rocksmith' ? palette.primary : 'transparent',
    shadowColor: palette.text, // Or a dedicated shadow color from palette
    shadowOpacity: palette.background === THEME_PALETTES.rocksmith.background ? 0.4 : 0.2, // Example conditional based on a known palette color
    shadowRadius: 4,
    elevation: 3,
  },
  settingLabel: {
    color: themeName === 'rocksmith' ? palette.primary : palette.text,
    fontSize: 18,
    fontWeight: '600',
  },
  settingDescription: {
    color: palette.text,
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
    maxWidth: '80%',
  },
  backButton: {
    backgroundColor: palette.button,
    borderColor: themeName === 'rocksmith' ? palette.primary : 'transparent',
    borderWidth: themeName === 'rocksmith' ? 2 : 0,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 32,
  },
  backButtonText: {
    color: palette.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: palette.modalBackground, // Or card
    color: palette.text,
    borderRadius: 8,
    borderWidth: themeName === 'rocksmith' ? 2 : 1,
    borderColor: themeName === 'rocksmith' ? palette.primary : palette.fretboardBorder,
    marginVertical: 4,
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  swatch: {
    width: 28,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 8,
  },
  swatchLabel: {
    color: palette.text,
    fontSize: 12,
    marginRight: 12,
  },
  
});


const Settings: React.FC<SettingsProps> = ({ onBack, soundEnabled, setSoundEnabled, hapticsEnabled, setHapticsEnabled }) => {
  const { themeName, setThemeName, palette } = React.useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const isPortrait = width < 400;

  const dims = useWindowDimensions();
  const isLandscape = dims.width > dims.height;
  const s = styles(palette, themeName);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
      {Platform.OS === 'android' && (
        <StatusBar backgroundColor={palette.background} barStyle={themeName === 'rocksmith' ? 'light-content' : 'dark-content'} />
      )}
      <View style={s.container}>
        <Text style={s.title}>Settings</Text>

      {/* Theme selection */}
      <View style={s.settingRow}>
        <View>
          <Text style={s.settingLabel}>Theme</Text>
          <Text style={s.settingDescription}>
            Choose your preferred application theme.
          </Text>
        </View>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <View
            style={{
              backgroundColor: palette.modalBackground, // or card
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: themeName === 'rocksmith' ? palette.primary : palette.fretboardBorder,
              overflow: 'hidden', // Ensures the Picker respects the border radius
            }}>
            <Picker
              selectedValue={themeName}
              onValueChange={(itemValue) => setThemeName(itemValue as ThemeName)}
              style={s.picker}
              itemStyle={{ color: palette.text, backgroundColor: palette.modalBackground }}
              dropdownIconColor={palette.primary}
            >
              {Object.keys(THEME_PALETTES).map((key) => (
                <Picker.Item key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={key} />
              ))}
            </Picker>
          </View>
        </View>

      </View>
      
      
        <Button onPress={onBack} style={s.backButton}>
          <Text style={s.backButtonText}>Back to Menu</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default Settings
