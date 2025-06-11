import React from "react";
import { View, Text, StyleSheet, Switch, ScrollView, useWindowDimensions } from "react-native";
import Button from "../../components/ui/button";
import { Picker } from '@react-native-picker/picker';

import { ThemeContext, THEME_PALETTES, ThemeName, ThemePalette } from '../ThemeContext';

interface SettingsProps {
  onBack: () => void;
  manualMode: boolean;
  difficulty: number;
  setManualMode: (value: boolean) => void;
  setDifficulty: (value: number) => void;
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
  switchTrack: {
    backgroundColor: palette.fretboardBorder, // Or a specific switch track color
  },
  switchThumb: {
    backgroundColor: palette.primary, // Or a specific switch thumb color
  },
});


const Settings: React.FC<SettingsProps> = ({ onBack, manualMode, setManualMode, difficulty, setDifficulty }) => {
  const { themeName, setThemeName, palette } = React.useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const isPortrait = width < 400;

  const dims = useWindowDimensions();
  const isLandscape = dims.width > dims.height;
  const s = styles(palette, themeName);
  return (
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
      
      <View style={s.settingRow}>
        <View>
          <Text style={s.settingLabel}>Manual Mode</Text>
          <Text style={s.settingDescription}>
            Enable precise control of note positions on the fretboard.
            This mode is intended for debugging and works best on larger screens.
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#CCCCCC", true: "#74512D" }}
          thumbColor={manualMode ? "#F8F4E1" : "#F8F4E1"}
          ios_backgroundColor="#CCCCCC"
          onValueChange={(value) => setManualMode(value)}
          value={manualMode}
        />
      </View>
      <View style={s.settingRow}>
        <View>
          <Text style={s.settingLabel}>Change Difficulty</Text>
          <Text style={s.settingDescription}>
            How many positions are shown on the fretboard at once.
            0 is open string, 1 is first fret, etc.
          </Text>
          <View style={{ marginTop: 12 }}>
            {/* Responsive orientation: useWindowDimensions triggers re-render on change */}
            {isLandscape ? (
              <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'nowrap' }}>
                {[...Array(13).keys()].map((level) => (
                  <Button
                    key={level}
                    style={{
                      backgroundColor: difficulty === level ? "#543310" : "#AF8F6F",
                      marginHorizontal: 3,
                      minWidth: 36,
                      paddingVertical: 8,
                      borderRadius: 8,
                    }}
                    onPress={() => setDifficulty(level)}
                  >
                    <Text style={{ color: "#F8F4E1", fontSize: 16 }}>{level}</Text>
                  </Button>
                ))}
              </View>
            ) : (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 6 }}>
                  {[...Array(7).keys()].map((level) => (
                    <Button
                      key={level}
                      style={[
                        {
                          minWidth: 28,
                          height: 28,
                          paddingVertical: 0,
                          paddingHorizontal: 0,
                          marginHorizontal: 2,
                          borderRadius: 6,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: themeName === 'rocksmith' ? 2 : 1,
                          borderColor: themeName === 'rocksmith' ? palette.primary : palette.fretboardBorder,
                          backgroundColor:
                            themeName === 'rocksmith'
                              ? (difficulty === level ? palette.primary : palette.modalBackground) // Rocksmith active/inactive
                              : (difficulty === level ? palette.button : palette.modalBackground), // Other themes active/inactive
                        },
                      ]}
                      onPress={() => setDifficulty(level)}
                    >
                      <Text style={{
                        color:
                          themeName === 'rocksmith'
                            ? (difficulty === level ? palette.modalBackground : palette.primary) // Rocksmith text active/inactive
                            : (difficulty === level ? palette.buttonText : palette.text), // Other themes text active/inactive
                        fontWeight: 'bold',
                        fontSize: 13,
                        textAlign: 'center',
                      }}>{level + 1}</Text>
                    </Button>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  {[...Array(6).keys()].map((i) => {
                    const level = i + 7;
                    return (
                      <Button
                        key={level}
                        style={[
                          {
                            minWidth: 28,
                            height: 28,
                            paddingVertical: 0,
                            paddingHorizontal: 0,
                            marginHorizontal: 2,
                            borderRadius: 6,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: themeName === 'rocksmith' ? 2 : 1,
                            borderColor: themeName === 'rocksmith' ? palette.primary : palette.fretboardBorder,
                            backgroundColor:
                              themeName === 'rocksmith'
                                ? (difficulty === level ? palette.primary : palette.modalBackground)
                                : (difficulty === level ? palette.button : palette.modalBackground),
                          },
                        ]}
                        onPress={() => setDifficulty(level)}
                      >
                        <Text style={{
                          color:
                            themeName === 'rocksmith'
                              ? (difficulty === level ? palette.modalBackground : palette.primary)
                              : (difficulty === level ? palette.buttonText : palette.text),
                          fontWeight: 'bold',
                          fontSize: 13,
                          textAlign: 'center',
                        }}>{level}</Text>
                      </Button>
                    );
                  })}
                </View>
              </>
            )}
          </View>
          <Text style={{ color: palette.text, fontSize: 14, marginTop: 4 }}>Current Difficulty: {difficulty}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
        </View>   
      </View>
      
      <Button onPress={onBack} style={s.backButton}>
        <Text style={s.backButtonText}>Back to Menu</Text>
      </Button>
    </View>
  )
}

export default Settings
