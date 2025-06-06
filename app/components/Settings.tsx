import React from "react";
import { View, Text, StyleSheet, Switch, ScrollView, useWindowDimensions } from "react-native";
import Button from "../../components/ui/button";
import { Picker } from '@react-native-picker/picker';

import { ThemeContext } from '../_layout';

interface SettingsProps {
  onBack: () => void;
  manualMode: boolean;
  difficulty: number;
  setManualMode: (value: boolean) => void;
  setDifficulty: (value: number) => void;
}

const styles = (theme: 'light' | 'dark' | 'rocksmith') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'rocksmith' ? '#181A1B' : theme === 'dark' ? '#232526' : '#F8F4E1',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  title: {
    color: theme === 'rocksmith' ? '#FFD900' : '#543310',
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
    backgroundColor: theme === 'rocksmith' ? '#232526' : '#AF8F6F',
    borderRadius: 8,
    borderWidth: theme === 'rocksmith' ? 2 : 0,
    borderColor: theme === 'rocksmith' ? '#FFD900' : 'transparent',
    shadowColor: theme === 'rocksmith' ? '#000' : '#543310',
    shadowOpacity: theme === 'rocksmith' ? 0.4 : 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLabel: {
    color: theme === 'rocksmith' ? '#FFD900' : '#543310',
    fontSize: 18,
    fontWeight: '600',
  },
  settingDescription: {
    color: theme === 'rocksmith' ? '#FFF' : '#543310',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
    maxWidth: '80%',
  },
  backButton: {
    backgroundColor: theme === 'rocksmith' ? '#232526' : '#74512D',
    borderColor: theme === 'rocksmith' ? '#FFD900' : 'transparent',
    borderWidth: theme === 'rocksmith' ? 2 : 0,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 32,
  },
  backButtonText: {
    color: theme === 'rocksmith' ? '#FFD900' : '#F8F4E1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: theme === 'rocksmith' ? '#232526' : '#FFF',
    color: theme === 'rocksmith' ? '#FFD900' : '#543310',
    borderRadius: 8,
    borderWidth: theme === 'rocksmith' ? 2 : 1,
    borderColor: theme === 'rocksmith' ? '#FFD900' : '#AF8F6F',
    marginVertical: 4,
  },
  switchTrack: {
    backgroundColor: theme === 'rocksmith' ? '#444' : '#C0C0C0',
  },
  switchThumb: {
    backgroundColor: theme === 'rocksmith' ? '#FFD900' : '#FFF',
  },
});


const Settings: React.FC<SettingsProps> = ({ onBack, manualMode, setManualMode, difficulty, setDifficulty }) => {
  const { theme, setTheme } = React.useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const isPortrait = width < 400;

  const dims = useWindowDimensions();
  const isLandscape = dims.width > dims.height;
  const s = styles(theme);
  return (
    <View style={s.container}>
      <Text style={s.title}>Settings</Text>

      {/* Theme selection */}
      <View style={s.settingRow}>
        <View>
          <Text style={s.settingLabel}>Theme</Text>
          <Text style={s.settingDescription}>
            Choose between light and dark mode.
          </Text>
        </View>
        {/* Responsive theme button row */}
        {/* Theme dropdown - nicer UI */}
        <View style={{ paddingHorizontal: 16, width: '100%' }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 16,
            marginBottom: 6,
            color: theme === 'dark' ? '#fff' : '#543310',
            marginLeft: 4,
          }}>
            Valitse teema
          </Text>
          <View
            style={{
              backgroundColor: theme === 'dark' ? '#322015' : '#fff9ef',
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: theme === 'dark' ? '#F8F4E1' : '#543310',
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
              marginBottom: 14,
              paddingHorizontal: 8,
              justifyContent: 'center',
              width: 90,
              alignSelf: 'flex-start',
            }}
          >
            <Picker
              selectedValue={theme}
              onValueChange={(itemValue: 'light' | 'dark' | 'rocksmith') => setTheme(itemValue)}
              style={{
                color: theme === 'dark' ? '#fff' : '#543310',
                fontSize: 18,
                minHeight: 48,
                backgroundColor: 'transparent',
                width: 90,
              }}
              dropdownIconColor={theme === 'dark' ? '#fff' : '#543310'}
              mode="dropdown"
            >
              <Picker.Item label="Vaalea" value="light" />
              <Picker.Item label="Tumma" value="dark" />
              <Picker.Item label="Rocksmith" value="rocksmith" />
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
                          borderWidth: theme === 'rocksmith' ? 2 : 1,
                          borderColor: theme === 'rocksmith' ? '#FFD900' : '#AF8F6F',
                          backgroundColor:
                            theme === 'rocksmith'
                              ? (difficulty === level ? '#FFD900' : '#232526')
                              : (difficulty === level ? '#543310' : '#AF8F6F'),
                        },
                      ]}
                      onPress={() => setDifficulty(level)}
                    >
                      <Text style={{
                        color:
                          theme === 'rocksmith'
                            ? (difficulty === level ? '#232526' : '#FFD900')
                            : '#F8F4E1',
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
                            borderWidth: theme === 'rocksmith' ? 2 : 1,
                            borderColor: theme === 'rocksmith' ? '#FFD900' : '#AF8F6F',
                            backgroundColor:
                              theme === 'rocksmith'
                                ? (difficulty === level ? '#FFD900' : '#232526')
                                : (difficulty === level ? '#543310' : '#AF8F6F'),
                          },
                        ]}
                        onPress={() => setDifficulty(level)}
                      >
                        <Text style={{
                          color:
                            theme === 'rocksmith'
                              ? (difficulty === level ? '#232526' : '#FFD900')
                              : '#F8F4E1',
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
          <Text style={{ color: "#543310", fontSize: 14, marginTop: 4 }}>Current Difficulty: {difficulty}</Text>
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
