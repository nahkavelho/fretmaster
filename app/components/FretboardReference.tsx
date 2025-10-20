import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/button';
import { ThemeContext, ThemeName, ThemePalette } from '../ThemeContext';

interface FretboardReferenceProps {
  onBack: () => void;
}

// Standard guitar tuning notes for each string (Low E to High E)
const STRING_NOTES = [
  ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'], // Low E (6th string)
  ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'], // A (5th string)
  ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'], // D (4th string)
  ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'], // G (3rd string)
  ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], // B (2nd string)
  ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'], // High E (1st string)
];

const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'E'];

// Acoustic theme colors (darker for light background)
const ACOUSTIC_COLORS = ['#CC0000', '#E67300', '#CC9900', '#009900', '#0000CC', '#CC00CC'];
// Rocksmith colors (brighter for dark background)
const ROCKSMITH_COLORS = ['#FF4444', '#FFA500', '#FFD700', '#44FF44', '#4444FF', '#FF44FF'];

const FretboardReference: React.FC<FretboardReferenceProps> = ({ onBack }) => {
  const { themeName, palette } = React.useContext(ThemeContext);

  const STRING_COLORS = themeName === 'rocksmith' ? ROCKSMITH_COLORS : ACOUSTIC_COLORS;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    title: {
      color: palette.text,
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    fretboardContainer: {
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: 'center',
    },
    fretRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: palette.fretboardBorder,
      paddingBottom: 6,
    },
    stringLabel: {
      width: 40,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    noteCell: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
    },
    noteText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    fretNumberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    fretNumber: {
      flex: 1,
      textAlign: 'center',
      color: palette.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    backButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: palette.button,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: themeName === 'rocksmith' ? 1 : 0,
      borderColor: themeName === 'rocksmith' ? palette.primary : 'transparent',
      zIndex: 100,
      elevation: 10,
    },
    backButtonText: {
      color: themeName === 'rocksmith' ? palette.primary : palette.buttonText,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'android' && (
        <StatusBar backgroundColor={palette.background} barStyle={themeName === 'rocksmith' ? 'light-content' : 'dark-content'} />
      )}
      
      <Button onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </Button>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Guitar Fretboard</Text>
        
        <View style={styles.fretboardContainer}>
          {/* Render each string */}
          {STRING_NOTES.map((stringNotes, stringIndex) => (
            <View key={stringIndex} style={styles.fretRow}>
              {stringNotes.map((note, fretIndex) => (
                <View key={fretIndex} style={styles.noteCell}>
                  <Text style={[styles.noteText, { color: STRING_COLORS[stringIndex] }]}>
                    {note}
                  </Text>
                </View>
              ))}
            </View>
          ))}
          
          {/* Fret numbers */}
          <View style={styles.fretNumberRow}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((fret) => (
              <Text key={fret} style={styles.fretNumber}>{fret}</Text>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FretboardReference;
