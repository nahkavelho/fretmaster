import * as React from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import "../app.css";
import Fretboard from "./components/Fretboard";
import Button from "../components/ui/button";
import Menu from "./components/Menu";
import Campaign from "./components/Campaign";
import GenDotList, { ManualDotPosition } from "./components/DotPositions";
import { NoteDot } from "./components/DotPositions";
import LoginScreen from '../LoginScreen';
import { onAuthStateChanged, Auth } from "firebase/auth";
import { auth } from "../firebase";
import Settings from "./components/Settings";
import {Note} from "./components/DotPositions";

export const screenOptions = {
  headerShown: false,
}
const frets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const strings = [1, 2, 3, 4, 5, 6]
// Force light mode for the app

// Centralized UI sizing for all containers and buttons
const UI_SIZES = {
  answerBarHeight: '20%', // or e.g. 120 for px
  answerBarPadding: 28,
  answerBarGap: 8,
  menuButtonPaddingHorizontal: 32,
  menuButtonPaddingVertical: 16,
  menuButtonBorderRadius: 12,
  menuButtonMarginBottom: 48,
  menuButtonMarginHorizontal: 50,
  noteButtonMargin: 6,
  noteButtonPaddingHorizontal: 22,
  noteButtonPaddingVertical: 18,
  noteButtonBorderRadius: 16,
  noteButtonMinWidth: 56,
  noteButtonMinHeight: 48,
  noteButtonFontSize: 22,
};

function getStyles(theme: 'light' | 'dark' | 'rocksmith') {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme === 'rocksmith' ? '#181A1B' : '#F8F4E1',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fretboardContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: theme === 'rocksmith' ? '#181A1B' : '#F8F4E1',
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuButton: {
      backgroundColor: theme === 'rocksmith' ? '#232526' : '#AF8F6F',
      borderColor: theme === 'rocksmith' ? '#FFD900' : undefined,
      borderWidth: theme === 'rocksmith' ? 2 : 0,
      paddingHorizontal: UI_SIZES.menuButtonPaddingHorizontal,
      paddingVertical: UI_SIZES.menuButtonPaddingVertical,
      borderRadius: UI_SIZES.menuButtonBorderRadius,
      marginBottom: UI_SIZES.menuButtonMarginBottom,
      alignSelf: 'center',
      marginLeft: UI_SIZES.menuButtonMarginHorizontal,
      marginRight: UI_SIZES.menuButtonMarginHorizontal,
    },
    menuButtonText: {
      color: theme === 'rocksmith' ? '#FFD900' : '#543310',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    answerBar: {
      height: UI_SIZES.answerBarHeight,
      justifyContent: 'center',
      alignItems: 'center',
      gap: UI_SIZES.answerBarGap,
      padding: UI_SIZES.answerBarPadding,
      backgroundColor: theme === 'rocksmith' ? '#232526' : '#AF8F6F',
      borderTopWidth: theme === 'rocksmith' ? 3 : 0,
      borderColor: theme === 'rocksmith' ? '#FFD900' : undefined,
      borderRadius: theme === 'rocksmith' ? 20 : 0,
      shadowColor: theme === 'rocksmith' ? '#FFD900' : undefined,
      shadowOpacity: theme === 'rocksmith' ? 0.12 : 0,
      shadowRadius: theme === 'rocksmith' ? 16 : 0,
      shadowOffset: theme === 'rocksmith' ? { width: 0, height: 4 } : undefined,
      elevation: theme === 'rocksmith' ? 8 : 0,
      width: '100%',
    },
    resultText: {
      color: theme === 'rocksmith' ? '#FFD900' : '#543310',
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 6,
    },
    noteButton: {
      margin: UI_SIZES.noteButtonMargin,
      minWidth: UI_SIZES.noteButtonMinWidth,
      minHeight: UI_SIZES.noteButtonMinHeight,
      backgroundColor: theme === 'rocksmith' ? '#232526' : '#74512D',
      borderColor: theme === 'rocksmith' ? '#FFD900' : undefined,
      borderWidth: theme === 'rocksmith' ? 2 : 0,
      borderRadius: UI_SIZES.noteButtonBorderRadius,
      paddingHorizontal: UI_SIZES.noteButtonPaddingHorizontal,
      paddingVertical: UI_SIZES.noteButtonPaddingVertical,
    },
    noteButtonText: {
      color: theme === 'rocksmith' ? '#FFD900' : '#F8F4E1',
      fontWeight: 'bold',
      fontSize: UI_SIZES.noteButtonFontSize,
    },
  });
}


// Animated feedback component for result icon
const AnimatedFeedback: React.FC<{ resultMessage: string | null }> = ({ resultMessage }) => {
  const opacity = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if ("✅" === resultMessage || "❌" === resultMessage) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 12,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 380,
          delay: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing( opacity, {
        toValue: 1,
        delay: 100,
        useNativeDriver: true,
      }).start()   
    }
  }, [resultMessage])

  if (resultMessage) 
  return (
    <Animated.View style={{
      position: 'absolute',
      top: '45%',
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 100,
      opacity,
      pointerEvents: 'none',
    }}>
      {resultMessage === '✅' ? (
        <View style={{
          backgroundColor: 'rgba(58,125,58,0.07)',
          borderRadius: 999,
          paddingHorizontal: 28,
          paddingVertical: 14,
        }}>
          <Text style={{ fontSize: 56, fontWeight: 'bold', color: '#2E7D2E', textAlign: 'center' }}>✓</Text>
        </View>
      ) : resultMessage === '❌' ? (
        <View style={{
          backgroundColor: 'rgba(178,34,34,0.07)',
          borderRadius: 999,
          paddingHorizontal: 28,
          paddingVertical: 14,
        }}>
          <Text style={{ fontSize: 56, fontWeight: 'bold', color: '#FF1744', textAlign: 'center' }}>✖</Text>
        </View>
      ) : null }
    </Animated.View>
  )
  return null
}


import { ThemeContext } from './_layout';

export default function Screen() {
  const { theme, setTheme } = React.useContext(ThemeContext);
  const styles = getStyles(theme);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [authChecked, setAuthChecked] = React.useState(false);
  const [screen, setScreen] = React.useState<'menu' | 'campaign' | 'free' | 'settings' | 'profile'>('menu');
  // Free mode state (always defined, only used when in free mode)
  const [difficulty, setDifficulty] = React.useState(0);
  const [fretboardHeight, setFretboardHeight] = React.useState(140);
  const [manualMode, setManualMode] = React.useState(false);
  const [manualString, setManualString] = React.useState(0); // First string (High E, 0-indexed, at the top)
  const [manualFret, setManualFret] = React.useState(0);    // First fret
  const [verticalOffset, setVerticalOffset] = React.useState(0); // No additional offset by default
  const [horizontalOffset, setHorizontalOffset] = React.useState(0); // Horizontal offset
  const [noteDot, setNoteDot] = React.useState<NoteDot>(
    manualMode 
      ? ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
      : GenDotList(fretboardHeight, strings.length, difficulty)
  )
  const [resultMessage, setResultMessage] = React.useState<string | null>(null);
  const [lastCorrectNote, setLastCorrectNote] = React.useState<string | null>(null);
  const lastCorrectTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const [score, setScore] = React.useState(0);
  const [numberOfPositions, setNumberOfPositions] = React.useState(30)
  const [unlockedLevel, setUnlockedLevel] = React.useState(1);
  const [campaignMode, setCampaignMode] = React.useState(true)
  const [selectedLevel, setSelectedLevel] = React.useState(1)
  const [fullList, setFullList] = React.useState(true)
  const [lastIncorrectNote, setLastIncorrectNote] = React.useState<string | null>(null);
  const lastIncorrectTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const SetLevel = (level: number) => {
    setDifficulty(level - 1);
    setScreen('free');
    setNumberOfPositions(30)
    setScore(0)
    setSelectedLevel(level)
  }

  const ManageResultMessage = (message: string) => {
    setResultMessage(message)
    if (message === '✅') {
      lastCorrectTimeout.current = setTimeout(() => {
        setResultMessage(null)
      }, 380)
    } else if (message === '❌') {
      lastIncorrectTimeout.current = setTimeout(() => {
        setResultMessage(null)
      }, 380)
    }
  }

const NOTE_NAMES = (
  () => {
    const arr = GenDotList(
      fretboardHeight,
      strings.length,
      difficulty,
      undefined,
      undefined,
      verticalOffset,
      fullList
    )
      .map((note: Note) => note[2])
      .filter((value : string, index : number, self : string[]) => self.indexOf(value) === index)

    return arr
  }
)()
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
      setLoggedIn(!!user)
      setAuthChecked(true);
    })
    return unsubscribe
  }, [])

  if (!authChecked) {
    // Optionally show a loading spinner here
    return null
  }

  if (!loggedIn) {
    return <LoginScreen onLoginSuccess={() => setLoggedIn(true)} />;
  }

  if (screen === 'campaign'){
    return (
      <Campaign
        onBack={() => setScreen('menu')}
        onLevelSelect={SetLevel}
        unlockedLevel={unlockedLevel}
        score={score}
      />
    );
  }

  if (screen === 'settings') {
    return (
      <Settings
        onBack={() => setScreen('menu')}
        manualMode={manualMode}
        setManualMode={setManualMode}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
    )
  }

  if (screen === 'free') {
    const gameOver = numberOfPositions === 0;
    // Custom message based on score
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
      // Unlock next level if passed threshold (27)
      if (score >= 27 && selectedLevel === unlockedLevel && unlockedLevel < 12) {
        setUnlockedLevel(unlockedLevel + 1);
      }
    }
    return (
      <View style={styles.root}>
        <View style={[styles.fretboardContainer, theme === 'rocksmith' && { backgroundColor: '#181A1B' }]}>
          {/* Result Box Modal */}
          {gameOver && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.45)',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
            }}>
              <View style={{
                backgroundColor: theme === 'rocksmith' ? '#232526' : '#fffbe8',
                borderRadius: 24,
                padding: 32,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.13,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 4 },
                elevation: 8,
                minWidth: 280,
                maxWidth: 340,
              }}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: theme === 'rocksmith' ? '#FFD900' : '#543310', marginBottom: 10 }}>Game Over</Text>
                <Text style={{ fontSize: 26, fontWeight: 'bold', color: theme === 'rocksmith' ? '#FFD900' : '#2ecc40', marginBottom: 10 }}>Score: {score} / 30</Text>
                <Text style={{ fontSize: 18, color: theme === 'rocksmith' ? '#FFD900' : '#543310', marginBottom: 20, textAlign: 'center' }}>{performanceMsg}</Text>
                {score >= 27 && selectedLevel < 12 && (
                  <Button
                    style={[
                      {
                        backgroundColor: theme === 'rocksmith' ? (score >= 27 ? '#FFD900' : '#232526') : '#543310',
                        borderColor: theme === 'rocksmith' ? '#FFD900' : undefined,
                        borderWidth: theme === 'rocksmith' ? 2 : 0,
                        padding: 14,
                        borderRadius: 12,
                        width: 180,
                        marginBottom: 10,
                        alignItems: 'center',
                      },
                    ]}
                    onPress={() => {
                      // Aloita seuraava taso
                      setDifficulty(selectedLevel); // seuraava level (index)
                      setSelectedLevel(selectedLevel + 1);
                      setNumberOfPositions(30);
                      setScore(0);
                      setNoteDot(GenDotList(fretboardHeight, strings.length, selectedLevel));
                    }}
                  >
                    <Text style={{
                      color: theme === 'rocksmith' ? (score >= 27 ? '#232526' : '#FFD900') : '#F8F4E1',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}>Next Level</Text>
                  </Button>
                )}
                <Button
                  style={[
                    {
                      backgroundColor: theme === 'rocksmith' ? '#232526' : '#2ecc40',
                      borderColor: theme === 'rocksmith' ? '#FFD900' : undefined,
                      borderWidth: theme === 'rocksmith' ? 2 : 0,
                      padding: 14,
                      borderRadius: 12,
                      width: 180,
                      marginTop: 4,
                      marginBottom: 10,
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => {
                    setNoteDot(GenDotList(fretboardHeight, strings.length, difficulty));
                    setScore(0);
                    setNumberOfPositions(30);
                  }}
                >
                  <Text style={{
                    color: theme === 'rocksmith' ? '#FFD900' : '#fff',
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}>Play Again</Text>
                </Button>
                <Button
                  style={[
                    {
                      backgroundColor: theme === 'rocksmith' ? '#232526' : '#AF8F6F',
                      borderColor: theme === 'rocksmith' ? '#FFD900' : undefined,
                      borderWidth: theme === 'rocksmith' ? 2 : 0,
                      padding: 14,
                      borderRadius: 12,
                      width: 180,
                      marginTop: 6,
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => {
                    setScreen('menu');
                    setScore(0);
                    setNumberOfPositions(30);
                  }}
                >
                  <Text style={{
                    color: theme === 'rocksmith' ? '#FFD900' : '#543310',
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}>Back to Menu</Text>
                </Button>
              </View>
            </View>
          )}
          {/* Floating Menu/Reset Buttons - Top Left */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, position: 'absolute', top: 8, left: 8, zIndex: 11 }}>
            {campaignMode && (
              <Button
                style={[
                  styles.menuButton,
                  {
                    minWidth: 80,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    height: undefined,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme === 'rocksmith' ? '#232526' : styles.menuButton.backgroundColor,
                    borderColor: theme === 'rocksmith' ? '#FFD900' : undefined,
                    borderWidth: theme === 'rocksmith' ? 2 : 0,
                  },
                ]}
                onPress={() => setScreen('campaign')}
              >
                <Text
                  style={[
                    styles.menuButtonText,
                    {
                      fontSize: 16,
                      color: theme === 'rocksmith' ? '#FFD900' : styles.menuButtonText.color,
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  Menu
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
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme === 'rocksmith' ? '#232526' : styles.menuButton.backgroundColor,
                    borderColor: theme === 'rocksmith' ? '#FFD900' : undefined,
                    borderWidth: theme === 'rocksmith' ? 2 : 0,
                  },
                ]}
                onPress={() => {
                  setNoteDot(GenDotList(fretboardHeight, strings.length, difficulty));
                  setScore(0);
                  setNumberOfPositions(30);
                }}
              >
                <Text
                  style={[
                    styles.menuButtonText,
                    {
                      fontSize: 16,
                      color: theme === 'rocksmith' ? '#FFD900' : styles.menuButtonText.color,
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  Reset
                </Text>
              </Button>
            )}
          </View>
          {/* Score display in top right corner */}
          <View style={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            backgroundColor: theme === 'rocksmith' ? '#232526' : '#74512D',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: theme === 'rocksmith' ? 2 : 1,
            borderColor: theme === 'rocksmith' ? '#FFD900' : '#543310',
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 20
          }}>
            <Text style={{ 
              color: theme === 'rocksmith' ? '#FFD900' : "#F8F4E1", 
              fontWeight: 'bold', 
              fontSize: 18, 
              marginRight: 8, 
            }}>Score: {score}/30</Text>
          </View>
          {/* Overlay result message in the middle of the screen */}
          {/* Animated feedback icon */}
          <AnimatedFeedback resultMessage={resultMessage} />
          {/* UI for manual dot positioning */}
          {manualMode && (
            <View style={{
              flexDirection: 'column', // Stack vertically for better fit
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 6,
              gap: 6,
              padding: 6,
              backgroundColor: '#AF8F6F',
              borderRadius: 8,
              width: '98%', // Max width for mobile
              alignSelf: 'center',
            }}>
              <View style={{ alignItems: 'center', width: '100%' }}>
                <Text style={{ color: '#543310', marginBottom: 3, fontSize: 14 }}>Manual Position</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                  <Button
                    style={{ backgroundColor: manualMode ? '#543310' : '#74512D', padding: 8, minWidth: 80 }}
                    onPress={() => {
                      setManualMode(!manualMode);
                      // Update dot position based on new mode
                      setNoteDot(
                        !manualMode 
                          ? ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
                          : GenDotList(fretboardHeight, strings.length, difficulty )
                      );
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>{manualMode ? 'On' : 'Off'}</Text>
                  </Button>
                </View>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#543310', marginBottom: 5 }}>String</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newString = Math.max(0, manualString - 1);
                      setManualString(newString);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, newString, manualFret, verticalOffset, horizontalOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>-</Text>
                  </Button>
                  <Text style={{ color: '#543310', marginHorizontal: 10, fontWeight: 'bold' }}>{manualString + 1}</Text>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newString = Math.min(strings.length - 1, manualString + 1);
                      setManualString(newString);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, newString, manualFret, verticalOffset, horizontalOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>+</Text>
                  </Button>
                </View>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#543310', marginBottom: 5 }}>Fret</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newFret = Math.max(0, manualFret - 1);
                      setManualFret(newFret);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, manualString, newFret, verticalOffset, horizontalOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>-</Text>
                  </Button>
                  <Text style={{ color: '#543310', marginHorizontal: 10, fontWeight: 'bold' }}>{manualFret}</Text>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newFret = Math.min(12, manualFret + 1);
                      setManualFret(newFret);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, manualString, newFret, verticalOffset, horizontalOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>+</Text>
                  </Button>
                </View>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#543310', marginBottom: 5 }}>Vertical Offset</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newOffset = verticalOffset - 2 // Move up by 2px
                      setVerticalOffset(newOffset);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, newOffset, horizontalOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>↑</Text>
                  </Button>
                  <Text style={{ color: '#543310', marginHorizontal: 10, fontWeight: 'bold' }}>{verticalOffset}</Text>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newOffset = verticalOffset + 2; // Move down by 2px
                      setVerticalOffset(newOffset);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, newOffset, horizontalOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>↓</Text>
                  </Button>
                </View>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#543310', marginBottom: 5 }}>Horizontal Offset</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newOffset = horizontalOffset - 2; // Move left by 2px
                      setHorizontalOffset(newOffset);
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, newOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>←</Text>
                  </Button>
                  <Text style={{ color: '#543310', marginHorizontal: 10, fontWeight: 'bold' }}>{horizontalOffset}</Text>
                  <Button
                    style={{ backgroundColor: '#74512D', padding: 8 }}
                    onPress={() => {
                      const newOffset = horizontalOffset + 2; // Move right by 2px
                      setHorizontalOffset(newOffset)
                      setNoteDot(ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, newOffset))
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold' }}>→</Text>
                  </Button>
                </View>
              </View>
            </View>
          )}
          {/* Answer bar (note buttons) */}
          <View style={[styles.answerBar, { position: 'absolute', left: 0, right: 0, bottom: 0, margin: 0, borderRadius: 0, zIndex: 20 }]}> 
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 2 }}>
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginBottom: 2 }}>
                Guesses left: {numberOfPositions} | Current Note: {noteDot[2]} | String: {noteDot[3]+1} Fret: {noteDot[4]}
              </Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: 'center' }}>
              {NOTE_NAMES.map((note: string)  => (
                <Button
                  disabled={numberOfPositions === 0}
                  key={note}
                  onPress={() => {
                    setLastCorrectNote(noteDot[2]); // Always highlight the correct answer
                    if (lastCorrectTimeout.current) clearTimeout(lastCorrectTimeout.current);
                    lastCorrectTimeout.current = setTimeout(() => setLastCorrectNote(null), 500);
                    if (noteDot[2] === note) {
                      ManageResultMessage("✅")
                      setNoteDot(
                        manualMode 
                          ? ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
                          : GenDotList(fretboardHeight, strings.length, difficulty)
                      )
                      setScore(score + 1)
                      setNumberOfPositions(numberOfPositions - 1)
                    } else {
                      setLastIncorrectNote(note); // Highlight incorrect note
                      if (lastIncorrectTimeout.current) clearTimeout(lastIncorrectTimeout.current);
                      lastIncorrectTimeout.current = setTimeout(() => setLastIncorrectNote(null), 500);
                      ManageResultMessage("❌")
                      setNoteDot(
                        manualMode 
                          ? ManualDotPosition(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
                          : GenDotList(fretboardHeight, strings.length, difficulty)
                      );
                      setNumberOfPositions(numberOfPositions - 1);
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
          <View style={{ flexShrink: 1, width: '100%', justifyContent: 'flex-start', alignItems: 'center', marginTop: 40, marginBottom: 20 }}>
            <Fretboard
              frets={frets}
              strings={strings}
              fretboardHeight={fretboardHeight}
              noteDot={noteDot}
              difficulty={difficulty}
             
            />
          </View>
        </View>
      </View>
    );
  }

  // Profile screen
  if (screen === 'profile') {
    const user = auth.currentUser;
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F4E1' }]}> 
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 24,
          padding: 32,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.10,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
          minWidth: 320,
          maxWidth: 380,
        }}>
          {/* Profile avatar/icon */}
          <View style={{
            width: 80, height: 80, borderRadius: 40, backgroundColor: '#AF8F6F',
            alignItems: 'center', justifyContent: 'center', marginBottom: 18, borderWidth: 2, borderColor: '#74512D',
          }}>
            <Text style={{ fontSize: 40, color: '#F8F4E1', fontWeight: 'bold' }}>
              {user?.email ? user.email[0].toUpperCase() : 'U'}
            </Text>
          </View>
          {/* Profile title */}
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#543310', marginBottom: 10, letterSpacing: 1 }}>User Profile</Text>
          {/* Display name */}
          <Text style={{ fontSize: 20, color: '#543310', fontWeight: '600', marginBottom: 8, backgroundColor: '#F8F4E1', padding: 8, borderRadius: 8 }}>
            {user?.displayName || 'No display name set'}
          </Text>
          {/* Email */}
          <Text style={{ fontSize: 18, color: '#74512D', marginBottom: 24, fontWeight: '600', backgroundColor: '#F8F4E1', padding: 8, borderRadius: 8 }}>
            {user?.email || 'N/A'}
          </Text>
          <Button
            style={{ backgroundColor: "#74512D", padding: 14, borderRadius: 12, width: 180, marginTop: 4, shadowColor: '#74512D', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }}
            onPress={() => {
              import('react-native').then(({ Alert }) => {
                Alert.alert(
                  'Log out',
                  'Are you sure you want to log out?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Log out', style: 'destructive', onPress: async () => {
                        const { signOut } = await import('firebase/auth');
                        await signOut(auth);
                        setLoggedIn(false);
                        setScreen('menu');
                      }
                    },
                  ]
                );
              });
            }}
          >
            <Text style={{ color: "#F8F4E1", fontWeight: "bold", fontSize: 18 }}>Logout</Text>
          </Button>
          <Button
            style={{ backgroundColor: "#AF8F6F", padding: 14, borderRadius: 12, width: 180, marginTop: 16, shadowColor: '#74512D', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }}
            onPress={() => setScreen('menu')}
          >
            <Text style={{ color: "#543310", fontWeight: "bold", fontSize: 18 }}>Back to Menu</Text>
          </Button>
        </View>
      </View>
    );
  }

      // Default to menu
      return (
        <Menu
          onCampaign={() => {
        setScreen('campaign');
        setCampaignMode(true);
      }}
          onFreeMode={() => { 
        setScreen('free')
        setCampaignMode(false);
      }}
          onSettings={() => setScreen('settings')}
          // Add a Profile button to the menu
          extraButtons={
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <Button
                style={{ backgroundColor: "#AF8F6F", padding: 12, borderRadius: 8, minWidth: 110 }}
                onPress={() => setScreen('profile')}
              >
                <Text style={{ color: "#543310", fontWeight: "bold" }}>Profile</Text>
              </Button>
              <Button
                style={{ backgroundColor: "#b22222", padding: 12, borderRadius: 8, minWidth: 110 }}
                onPress={() => {
                  import('react-native').then(({ Alert }) => {
                    Alert.alert(
                      'Exit',
                      'Are you sure you want to exit the app?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Exit', style: 'destructive', onPress: () => {
                            // On mobile, use BackHandler.exitApp(); on web, show a message
                            import('react-native').then(({ BackHandler, Platform }) => {
                              if (Platform.OS === 'android') {
                                BackHandler.exitApp();
                              } else {
                                Alert.alert('Exit', 'Exit is only available on Android devices.');
                              }
                            });
                          }
                        },
                      ]
                    );
                  });
                }}
              >
                <Text style={{ color: "#F8F4E1", fontWeight: "bold" }}>Exit</Text>
              </Button>
            </View>
          }
        />
      );
    }