import * as React from 'react';
import { View, Text, Alert, ViewStyle, TextStyle, Animated } from 'react-native';
import Fretboard from "./Fretboard";
import Button from "../../components/ui/button"; // Adjusted path to root ui components
import GenDotList, { ManualDotPosition as ManualDotPositionFunction, NoteDot, Note } from "./DotPositions";
import { User as FirebaseUser } from 'firebase/auth';
import { saveUserLevel } from "../../firebase"; // Adjusted path to root firebase
import { ThemeName, ThemePalette } from '../ThemeContext';
import { UI_SIZES } from './uiConstants';
import AnimatedFeedback from './AnimatedFeedback';

interface GameScreenProps {
  styles: any; // Consider a more specific type based on getGlobalStyles
  themeName: ThemeName;
  palette: ThemePalette;
  currentScreen: string; // To manage screen-specific logic if any remains or for orientation
  setScreen: (screen: string) => void;
  loggedIn: boolean;
  user: FirebaseUser | null;
  authChecked: boolean;
  campaignMode: boolean;
  setCampaignMode: (mode: boolean) => void;
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
  selectedLevel: number;
  setSelectedLevel: (level: number) => void;
  unlockedLevel: number;
  setUnlockedLevel: (level: number) => void;
  score: number;
  setScore: (score: number) => void;
  resultMessage: string | null;
  setResultMessage: (message: string | null) => void;
  feedbackAnimation: Animated.Value;
  noteQueue: NoteDot[];
  setNoteQueue: (queue: NoteDot[]) => void;
  manualDot: NoteDot | null;
  setManualDot: (dot: NoteDot | null) => void;
  currentNote: Note | null; // This might be derived from noteDot
  setCurrentNote: (note: Note | null) => void;
  targetNote: Note | null; // This might be derived from noteDot
  setTargetNote: (note: Note | null) => void;
  lastCorrectNote: string | null;
  setLastCorrectNote: (note: string | null) => void;
  lastIncorrectNote: string | null;
  setLastIncorrectNote: (note: string | null) => void;
  ALL_CHROMATIC_NOTES_ORDERED: string[];
  frets: number[];
  strings: number[];
  fretboardHeight: number;
  noteDot: NoteDot; // This is crucial for the Fretboard component
  setNoteDot: (noteDot: NoteDot) => void;
  difficulty: number;
  setDifficulty: (difficulty: number) => void;
  manualMode: boolean;
  setManualMode: (mode: boolean) => void;
  manualString: number;
  setManualString: (str: number) => void;
  manualFret: number;
  setManualFret: (fret: number) => void;
  verticalOffset: number;
  setVerticalOffset: (offset: number) => void;
  horizontalOffset: number;
  setHorizontalOffset: (offset: number) => void;
  numberOfPositions: number;
  setNumberOfPositions: (num: number) => void;
  ManageResultMessage: (message: string) => void;
  lastCorrectTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
  lastIncorrectTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
  // UI_SIZES is imported directly
}

const GameScreen: React.FC<GameScreenProps> = ({
  styles,
  themeName,
  palette,
  setScreen,
  user,
  campaignMode,
  setCampaignMode,
  selectedLevel,
  setSelectedLevel,
  unlockedLevel,
  setUnlockedLevel,
  score,
  setScore,
  resultMessage, // Added prop
  setResultMessage,
  feedbackAnimation, // Added prop
  noteQueue, // Added to props
  setNoteQueue, // Added to props
  manualDot, // Added prop
  manualMode, // Added to props
  setManualMode, // Added to props
  manualString, // Added to props
  setManualString, // Added to props
  manualFret, // Added to props
  setManualFret, // Added to props
  verticalOffset, // Added to props
  setVerticalOffset, // Added to props
  horizontalOffset, // Added to props
  setHorizontalOffset, // Added to props
  fretboardHeight,
  noteDot,
  setNoteDot,
  difficulty,
  ALL_CHROMATIC_NOTES_ORDERED,
  frets,
  strings,
  numberOfPositions,
  setNumberOfPositions,
  ManageResultMessage,
  lastCorrectNote,
  setLastCorrectNote,
  lastIncorrectNote,
  setLastIncorrectNote,
  lastCorrectTimeout,
  lastIncorrectTimeout,
}) => {
  const gameOver = numberOfPositions === 0;
  let performanceMsg = ''
  if (gameOver) {
    if (score >= 30) {
      performanceMsg = 'Perfect! You got every note right!';
    }
    else if (score >= 27) {
      performanceMsg = 'Excellent! You really know your fretboard.';
    }
    else if (score >= 20) performanceMsg = 'Good job! Keep practicing to improve.';
    else performanceMsg = 'Keep practicing! You can do it!';
    if (campaignMode && score >= 27 && selectedLevel === unlockedLevel && unlockedLevel < 12) {
      const newUnlockedLevel = unlockedLevel + 1;
      setUnlockedLevel(newUnlockedLevel);
      if (user) {
        saveUserLevel(user.uid, newUnlockedLevel)
          .then(() => console.log(`Level ${newUnlockedLevel} unlocked and saved for user ${user.uid}`))
          .catch((err: Error) => console.error("Failed to save unlocked level:", err));
      }
    }
  }

  return (
    <View style={styles.root}>
      <View style={[styles.fretboardContainer, themeName === 'rocksmith' && { backgroundColor: '#181A1B' }]}>
        {/* Result Box Modal */}
        {gameOver && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            zIndex: 999,
          }}>
            <View style={{
              backgroundColor: themeName === 'rocksmith' ? '#232526' : '#fffbe8',
              borderRadius: 24,
              padding: 32,
              alignItems: 'center' as const,
              shadowColor: '#000',
              shadowOpacity: 0.13,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 4 },
              elevation: 8,
              minWidth: 280,
              maxWidth: 340,
            }}>
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: themeName === 'rocksmith' ? '#FFD900' : '#543310', marginBottom: 10 }}>Game Over</Text>
              <Text style={{ fontSize: 26, fontWeight: 'bold', color: themeName === 'rocksmith' ? '#FFD900' : '#2ecc40', marginBottom: 10 }}>Score: {score} / 30</Text>
              <Text style={{ fontSize: 18, color: themeName === 'rocksmith' ? '#FFD900' : '#543310', marginBottom: 20, textAlign: 'center' as const }}>{performanceMsg}</Text>
              {score >= 27 && selectedLevel < 12 && (
                <Button
                  style={[
                    {
                      backgroundColor: themeName === 'rocksmith' ? (score >= 27 ? '#FFD900' : '#232526') : '#543310',
                      borderColor: themeName === 'rocksmith' ? '#FFD900' : undefined,
                      borderWidth: themeName === 'rocksmith' ? 2 : 0,
                      padding: 14,
                      borderRadius: 12,
                      width: 180,
                      marginBottom: 10,
                      alignItems: 'center' as const,
                    },
                  ]}
                  onPress={() => {
                    if (selectedLevel < 12) {
                      setSelectedLevel(selectedLevel + 1);
                    }
                  }}
                >
                  <Text style={{
                    color: themeName === 'rocksmith' ? (score >= 27 ? '#232526' : '#FFD900') : '#F8F4E1',
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}>Next Level</Text>
                </Button>
              )}
              <Button
                style={[
                  {
                    backgroundColor: themeName === 'rocksmith' ? '#232526' : '#2ecc40',
                    borderColor: themeName === 'rocksmith' ? '#FFD900' : undefined,
                    borderWidth: themeName === 'rocksmith' ? 2 : 0,
                    padding: 14,
                    borderRadius: 12,
                    width: 180,
                    marginTop: 4,
                    marginBottom: 10,
                    alignItems: 'center' as const,
                  },
                ]}
                onPress={() => {
                  setScore(0);
                  setNumberOfPositions(30);
                  const currentDifficultyForReset = campaignMode ? selectedLevel - 1 : difficulty;
                  setNoteDot(GenDotList(fretboardHeight, strings.length, currentDifficultyForReset < 0 ? 0 : currentDifficultyForReset));
                  setNoteQueue([]);
                  setLastCorrectNote(null);
                  setLastIncorrectNote(null);
                  setResultMessage(null);
                }}
              >
                <Text style={{
                  color: themeName === 'rocksmith' ? '#FFD900' : '#fff',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>Play Again</Text>
              </Button>
              <Button
                style={[
                  {
                    backgroundColor: themeName === 'rocksmith' ? '#232526' : '#AF8F6F',
                    borderColor: themeName === 'rocksmith' ? '#FFD900' : undefined,
                    borderWidth: themeName === 'rocksmith' ? 2 : 0,
                    padding: 14,
                    borderRadius: 12,
                    width: 180,
                    marginTop: 6,
                    alignItems: 'center' as const,
                  },
                ]}
                onPress={() => {
                  setScreen('menu');
                  setScore(0);
                  setNumberOfPositions(30);
                }}
              >
                <Text style={{
                  color: themeName === 'rocksmith' ? '#FFD900' : '#543310',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>Back to Menu</Text>
              </Button>
            </View>
          </View>
        )}
        {/* Floating Menu/Reset Buttons - Top Left */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, position: 'absolute', top: 8, left: 8, zIndex: 11 }}>
          <Button
            style={[
              styles.menuButton,
              {
                minWidth: 80,
                paddingVertical: 6,
                paddingHorizontal: 12,
                height: undefined,
                alignItems: 'center' as const,
                justifyContent: 'center' as const,
                backgroundColor: palette.notification, 
                borderColor: palette.primary, 
                borderWidth: 2,
                marginLeft: 0, 
                marginRight: 0,
                marginBottom: 0,
              },
            ]}
            onPress={() => {
              setScore(0);
              setNumberOfPositions(30);
              const currentDifficultyForReset = campaignMode ? selectedLevel - 1 : difficulty;
              setNoteDot(GenDotList(fretboardHeight, strings.length, currentDifficultyForReset < 0 ? 0 : currentDifficultyForReset));
              setNoteQueue([]);
              setLastCorrectNote(null);
              setLastIncorrectNote(null);
              setResultMessage(null);
            }}
          >
            <Text
              style={[
                styles.menuButtonText,
                {
                  fontSize: 16,
                  color: palette.buttonText, 
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Reset
            </Text>
          </Button>

          {campaignMode && (
            <Button
              style={[
                styles.menuButton,
                {
                  minWidth: 80,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  height: undefined,
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const,
                  backgroundColor: palette.card, 
                  borderColor: palette.primary, 
                  borderWidth: 2,
                  marginLeft: 0, 
                  marginRight: 0,
                  marginBottom: 0,
                },
              ]}
              onPress={() => {
                setScreen('campaign');
                setCampaignMode(false); // Exit campaign mode when going back to level selection
              }}
            >
              <Text
                style={[
                  styles.menuButtonText,
                  {
                    fontSize: 16,
                    color: palette.text, 
                  },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Levels
              </Text>
            </Button>
          )}

          {!campaignMode && (
            <Button
              style={[
                styles.menuButton,
                {
                  minWidth: 80,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  height: undefined,
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const,
                  backgroundColor: palette.card, 
                  borderColor: palette.primary, 
                  borderWidth: 2,
                  marginLeft: 0, 
                  marginRight: 0,
                  marginBottom: 0,
                },
              ]}
              onPress={() => setScreen('menu')}
            >
              <Text
                style={[
                  styles.menuButtonText,
                  {
                    fontSize: 16,
                    color: palette.text, 
                  },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Menu
              </Text>
            </Button>
          )}
        </View>

        {/* Floating Settings/Manual Mode Button - Top Right */}
        <View style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <Button
            style={[
              styles.menuButton,
              {
                minWidth: 80,
                paddingVertical: 6,
                paddingHorizontal: 12,
                height: undefined,
                alignItems: 'center' as const,
                justifyContent: 'center' as const,
                backgroundColor: palette.card, 
                borderColor: palette.primary, 
                borderWidth: 2,
                marginLeft: 0, 
                marginRight: 0,
                marginBottom: 0,
              },
            ]}
            onPress={() => setScreen('settings')}
          >
            <Text
              style={[
                styles.menuButtonText,
                {
                  fontSize: 16,
                  color: palette.text, 
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Settings
            </Text>
          </Button>
        </View>

        {/* Score and Level Display - Centered Top */}
        <View style={{ alignItems: 'center' as const, position: 'absolute', top: 8, left: 0, right: 0, zIndex: 9 }}>
          <Text style={{ color: palette.text, fontWeight: "bold", fontSize: 18 }}>
            {campaignMode ? `Level: ${selectedLevel} | ` : ''}Score: {score}
          </Text>
        </View>

        {/* Animated Feedback */}
        <AnimatedFeedback resultMessage={resultMessage} feedbackAnimation={feedbackAnimation} styles={styles} />

        {/* Manual Mode Controls (only if manualMode is true) */}
        {manualMode && (
          <View style={{
            flexDirection: 'row' as const, justifyContent: 'space-around' as const, alignItems: 'center' as const, paddingVertical: 4, paddingHorizontal: 4,
            backgroundColor: palette.background, // Use a contrasting background
            borderRadius: 8, marginHorizontal: 20, marginTop: 50, marginBottom: 0, // Adjusted top margin
            borderColor: palette.primary, borderWidth: 1, zIndex: 5
          }}>
            <View style={{ alignItems: 'center' as const }}> {/* String Controls */} 
              <Text style={{ color: '#543310', marginBottom: 1, fontSize: 10 }}>String</Text>
              <View style={{ flexDirection: 'row' as const, alignItems: 'center' as const }}>
                <Button
                  style={{ backgroundColor: '#74512D', paddingVertical: 4, paddingHorizontal: 8 }}
                  onPress={() => {
                    const newString = Math.max(1, manualString - 1);
                    setManualString(newString);
                    setNoteDot(ManualDotPositionFunction(fretboardHeight, strings.length, newString, manualFret, verticalOffset, horizontalOffset));
                  }}
                >
                  <Text style={{ color: '#F8F4E1', fontWeight: 'bold', fontSize: 12 }}>-</Text>
                </Button>
                <Text style={{ color: '#543310', marginHorizontal: 6, fontWeight: 'bold', fontSize: 12 }}>{manualString}</Text>
                <Button
                  style={{ backgroundColor: '#74512D', paddingVertical: 4, paddingHorizontal: 8 }}
                  onPress={() => {
                    const newString = Math.min(strings.length, manualString + 1);
                    setManualString(newString);
                    setNoteDot(ManualDotPositionFunction(fretboardHeight, strings.length, newString, manualFret, verticalOffset, horizontalOffset));
                  }}
                >
                  <Text style={{ color: '#F8F4E1', fontWeight: 'bold', fontSize: 12 }}>+</Text>
                </Button>
              </View>
            </View>
            <View style={{ alignItems: 'center' as const }}> {/* Fret Controls */} 
              <Text style={{ color: '#543310', marginBottom: 1, fontSize: 10 }}>Fret</Text>
              <View style={{ flexDirection: 'row' as const, alignItems: 'center' as const }}>
                <Button
                  style={{ backgroundColor: '#74512D', paddingVertical: 4, paddingHorizontal: 8 }}
                  onPress={() => {
                    const newFret = Math.max(0, manualFret - 1);
                    setManualFret(newFret);
                    setNoteDot(ManualDotPositionFunction(fretboardHeight, strings.length, manualString, newFret, verticalOffset, horizontalOffset));
                  }}
                >
                  <Text style={{ color: '#F8F4E1', fontWeight: 'bold', fontSize: 12 }}>-</Text>
                </Button>
                <Text style={{ color: '#543310', marginHorizontal: 6, fontWeight: 'bold', fontSize: 12 }}>{manualFret}</Text>
                <Button
                  style={{ backgroundColor: '#74512D', paddingVertical: 4, paddingHorizontal: 8 }}
                  onPress={() => {
                    const newFret = Math.min(12, manualFret + 1);
                    setManualFret(newFret);
                    setNoteDot(ManualDotPositionFunction(fretboardHeight, strings.length, manualString, newFret, verticalOffset, horizontalOffset));
                  }}
                >
                  <Text style={{ color: '#F8F4E1', fontWeight: 'bold', fontSize: 12 }}>+</Text>
                </Button>
              </View>
            </View>
            <View style={{ alignItems: 'center' as const }}> {/* V-Offset Controls */} 
              <Text style={{ color: '#543310', marginBottom: 1, fontSize: 10 }}>V-Off</Text>
              <View style={{ flexDirection: 'row' as const, alignItems: 'center' as const }}>
                <Button
                  style={{ backgroundColor: '#74512D', paddingVertical: 4, paddingHorizontal: 8 }}
                  onPress={() => {
                    const newOffset = verticalOffset - 2
                    setVerticalOffset(newOffset);
                    setNoteDot(ManualDotPositionFunction(fretboardHeight, strings.length, manualString, manualFret, newOffset, horizontalOffset));
                  }}
                >
                  <Text style={{ color: '#F8F4E1', fontWeight: 'bold', fontSize: 12 }}>↑</Text>
                </Button>
                <Text style={{ color: '#543310', marginHorizontal: 6, fontWeight: 'bold', fontSize: 12 }}>{verticalOffset}</Text>
                <Button
                  style={{ backgroundColor: '#74512D', paddingVertical: 4, paddingHorizontal: 8 }}
                  onPress={() => {
                    const newOffset = verticalOffset + 2;
                    setVerticalOffset(newOffset);
                    setNoteDot(ManualDotPositionFunction(fretboardHeight, strings.length, manualString, manualFret, newOffset, horizontalOffset));
                  }}
                >
                  <Text style={{ color: '#F8F4E1', fontWeight: 'bold', fontSize: 12 }}>↓</Text>
                </Button>
              </View>
            </View>
            <View style={{ alignItems: 'center' as const }}> {/* H-Offset Controls */} 
              <Text style={{ color: '#543310', marginBottom: 1, fontSize: 10 }}>H-Off</Text>
              <View style={{ flexDirection: 'row' as const, alignItems: 'center' as const }}>
                <Button
                  style={{ backgroundColor: '#74512D', paddingVertical: 4, paddingHorizontal: 8 }}
                  onPress={() => {
                    const newOffset = horizontalOffset - 2;
                    setHorizontalOffset(newOffset);
                    setNoteDot(ManualDotPositionFunction(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, newOffset));
                  }}
                >
                  <Text style={{ color: '#F8F4E1', fontWeight: 'bold', fontSize: 12 }}>←</Text>
                </Button>
                <Text style={{ color: '#543310', marginHorizontal: 6, fontWeight: 'bold', fontSize: 12 }}>{horizontalOffset}</Text>
                <Button
                  style={{ backgroundColor: '#74512D', paddingVertical: 4, paddingHorizontal: 8 }}
                  onPress={() => {
                    const newOffset = horizontalOffset + 2;
                    setHorizontalOffset(newOffset)
                    setNoteDot(ManualDotPositionFunction(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, newOffset))
                  }}
                >
                  <Text style={{ color: '#F8F4E1', fontWeight: 'bold', fontSize: 12 }}>→</Text>
                </Button>
              </View>
            </View>
            <View style={{ alignItems: 'center' as const, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: palette.fretboardBackground, borderRadius: 4, minWidth: 150, justifyContent: 'center' as const, marginTop: 4 }}>
              <Text style={{ color: palette.buttonText, fontSize: UI_SIZES.noteButtonFontSize - 2 }}>
                Current: {manualDot ? `${manualDot[2]} (S:${manualDot[3]+1} F:${manualDot[4]})` : 'N/A'}
              </Text>
            </View>
          </View>
        )}
        {/* Answer bar (note buttons) */}
        <View style={[styles.answerBar, { position: 'absolute', left: 0, right: 0, bottom: 0, margin: 0, borderRadius: 0, zIndex: 20 }]}> 
          <View style={{ width: '100%', alignItems: 'center' as const, marginBottom: 2 }}>
            <Text style={{ color: palette.text, fontWeight: "bold", fontSize: 16, marginBottom: 2 }}>
              Guesses left: {numberOfPositions} | Current Note: {noteDot[2]} | String: {noteDot[3]+1} Fret: {noteDot[4]}
            </Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: 'center' as const }}>
            {ALL_CHROMATIC_NOTES_ORDERED.map((note: string)  => (
              <Button
                disabled={numberOfPositions === 0}
                key={note}
                onPress={() => {
                  setLastCorrectNote(noteDot[2]);
                  if (lastCorrectTimeout.current) clearTimeout(lastCorrectTimeout.current);
                  lastCorrectTimeout.current = setTimeout(() => setLastCorrectNote(null), 500);

                  const currentNoteGenDifficulty = campaignMode 
                    ? (selectedLevel - 1)
                    : difficulty;
                  
                  const nextNoteDot = manualMode
                    ? ManualDotPositionFunction(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
                    : GenDotList(fretboardHeight, strings.length, currentNoteGenDifficulty < 0 ? 0 : currentNoteGenDifficulty);

                  if (noteDot[2] === note) {
                    ManageResultMessage("✅");
                    setScore(score + 1);
                    setNumberOfPositions(numberOfPositions - 1);
                    setNoteDot(nextNoteDot);
                  } else {
                    setLastIncorrectNote(note);
                    if (lastIncorrectTimeout.current) clearTimeout(lastIncorrectTimeout.current);
                    lastIncorrectTimeout.current = setTimeout(() => setLastIncorrectNote(null), 500);
                    
                    ManageResultMessage("❌");
                    setNumberOfPositions(numberOfPositions - 1);
                    setNoteDot(nextNoteDot);
                  }
                }}
                style={[
                  styles.noteButton,
                  lastCorrectNote === note ? { backgroundColor: '#2ecc40', borderWidth: 2, borderColor: '#145a1f' } : null,
                  lastIncorrectNote === note ? { backgroundColor: '#ff5555', borderWidth: 2, borderColor: '#a10000' } : null
                ]}
              >
                <Text style={styles.noteButtonText}>{note}</Text>
              </Button>
            ))}
          </View>
        </View>
        {/* Fretboard, slightly bigger height for better fit */}
        <View style={{ flexShrink: 1, width: '100%', justifyContent: 'flex-start', alignItems: 'center' as const, marginTop: 10, marginBottom: 20 }}>
          <Fretboard
            frets={frets}
            strings={strings}
            fretboardHeight={fretboardHeight}
            noteDot={noteDot}
            difficulty={difficulty}
            themeName={themeName}
            palette={palette}
          />
        </View>
      </View>
    </View>
  );
};

export default GameScreen;
