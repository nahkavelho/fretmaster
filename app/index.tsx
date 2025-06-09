import * as React from 'react';
import { useRouter } from 'expo-router'; // Removed Stack and Screen as ExpoRouterScreen
import * as ScreenOrientation from 'expo-screen-orientation';
import { View, Text, StyleSheet, Animated, Alert, ViewStyle, TextStyle } from 'react-native';
import Fretboard from "./components/Fretboard";
import Button from "../components/ui/button";
import Menu from "./components/Menu";
import Campaign from "./components/Campaign";
import GenDotList, { ManualDotPosition as ManualDotPositionFunction } from "./components/DotPositions";
import { NoteDot, Note } from "./components/DotPositions";
import LoginScreen from '../LoginScreen';
import { getAuth, onAuthStateChanged, User as FirebaseUser, signOut, Auth } from 'firebase/auth'; // Added FirebaseUser for clarity
import { auth, getUserLevel, saveUserLevel } from "../firebase"; // Add getUserLevel and saveUserLevel
import Settings from "./components/Settings";
import { ThemeContext, ThemeName, ThemePalette } from './ThemeContext';


const frets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const strings = [1, 2, 3, 4, 5, 6]
// Force light mode for the app

// Centralized UI sizing for all containers and buttons
const UI_SIZES = {
  answerBarHeight: '25%' as const, // or e.g. 120 for px
  answerBarPadding: 28,
  answerBarGap: 8,
  menuButtonPaddingHorizontal: 32,
  menuButtonPaddingVertical: 16,
  menuButtonBorderRadius: 12,
  menuButtonMarginBottom: 48,
  menuButtonMarginHorizontal: 50,
  noteButtonMargin: 6,
  noteButtonPaddingHorizontal: 10,
  noteButtonPaddingVertical: 8,
  noteButtonBorderRadius: 16,
  noteButtonMinWidth: 56,
  noteButtonMinHeight: 48,
  noteButtonFontSize: 16,
};

function getStyles(theme: 'light' | 'dark' | 'rocksmith', palette: any) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: palette.background,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    fretboardContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: palette.background,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    menuButton: {
      backgroundColor: palette.buttonBackground,
      borderColor: palette.buttonBorderColor,
      borderWidth: 2,
      paddingHorizontal: UI_SIZES.menuButtonPaddingHorizontal,
      paddingVertical: UI_SIZES.menuButtonPaddingVertical,
      borderRadius: UI_SIZES.menuButtonBorderRadius,
      marginBottom: UI_SIZES.menuButtonMarginBottom,
      alignSelf: 'center' as const,
      marginLeft: UI_SIZES.menuButtonMarginHorizontal,
      marginRight: UI_SIZES.menuButtonMarginHorizontal,
    },
    menuButtonText: {
      color: palette.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center' as const,
    },
    answerBar: {
      height: UI_SIZES.answerBarHeight,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      gap: UI_SIZES.answerBarGap,
      padding: UI_SIZES.answerBarPadding,
      backgroundColor: palette.answerBarBackground,
      borderTopWidth: 3,
      borderColor: palette.answerBarBorderColor,
      borderRadius: 20,
      shadowColor: palette.answerBarShadowColor,
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
      width: '100%',
    },
    resultText: {
      color: palette.resultTextColor,
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 6,
    },
    noteButton: {
      margin: UI_SIZES.noteButtonMargin,
      minWidth: UI_SIZES.noteButtonMinWidth,
      minHeight: UI_SIZES.noteButtonMinHeight,
      backgroundColor: palette.noteButtonBackground,
      borderColor: palette.noteButtonBorderColor,
      borderWidth: 2,
      borderRadius: UI_SIZES.noteButtonBorderRadius,
      paddingHorizontal: UI_SIZES.noteButtonPaddingHorizontal,
      paddingVertical: UI_SIZES.noteButtonPaddingVertical,
    },
    noteButtonText: {
      color: palette.noteButtonText,
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
      alignItems: 'center' as const,
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
          <Text style={{ fontSize: 56, fontWeight: 'bold', color: '#2E7D2E', textAlign: 'center' as const }}>✓</Text>
        </View>
      ) : resultMessage === '❌' ? (
        <View style={{
          backgroundColor: 'rgba(178,34,34,0.07)',
          borderRadius: 999,
          paddingHorizontal: 28,
          paddingVertical: 14,
        }}>
          <Text style={{ fontSize: 56, fontWeight: 'bold', color: '#FF1744', textAlign: 'center' as const }}>✖</Text>
        </View>
      ) : null }
    </Animated.View>
  )
  return null
}

export function FretboarderAppScreen() {
  const ALL_CHROMATIC_NOTES_ORDERED = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
  const { themeName, setThemeName, palette } = React.useContext(ThemeContext);

const getStyles = (themeName: ThemeName, palette: ThemePalette) => {
    const styleConfig = {
      root: {
        flex: 1,
        backgroundColor: palette.background,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      } as ViewStyle,
      fretboardContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: palette.background, // Use main screen background
      } as ViewStyle,
      menuButton: {
        borderColor: palette.primary,
        backgroundColor: palette.button,
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center' as const,
      } as ViewStyle,
      menuButtonText: {
        color: palette.buttonText,
        fontSize: 16,
        fontWeight: 'bold',
      } as TextStyle,
      answerBar: {
        height: UI_SIZES.answerBarHeight,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        gap: UI_SIZES.answerBarGap,
        padding: UI_SIZES.answerBarPadding,
        backgroundColor: palette.answerBarBackground,
        borderTopWidth: 3,
        borderColor: palette.answerBarBorderColor,
        borderRadius: 20,
        shadowColor: palette.answerBarShadowColor,
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
        width: '100%',
      } as ViewStyle,
      resultText: {
        color: palette.resultTextColor,
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 6,
      } as TextStyle,
      noteButton: {
        margin: UI_SIZES.noteButtonMargin,
        minWidth: UI_SIZES.noteButtonMinWidth,
        minHeight: UI_SIZES.noteButtonMinHeight,
        backgroundColor: palette.noteButtonBackground,
        borderColor: palette.noteButtonBorderColor,
        borderWidth: 2,
        borderRadius: UI_SIZES.noteButtonBorderRadius,
        paddingHorizontal: UI_SIZES.noteButtonPaddingHorizontal,
        paddingVertical: UI_SIZES.noteButtonPaddingVertical,
      } as ViewStyle,
      noteButtonText: {
        color: palette.noteButtonText,
        fontWeight: 'bold',
        fontSize: UI_SIZES.noteButtonFontSize,
      } as TextStyle,
    };
    return StyleSheet.create(styleConfig);
  };

  const styles = getStyles(themeName, palette);
  const [currentScreen, setScreen] = React.useState('menu'); // 'menu', 'free', 'campaign', 'settings', 'profile'
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [authChecked, setAuthChecked] = React.useState(false);
  const [campaignMode, setCampaignMode] = React.useState(false);
  const [currentLevel, setCurrentLevel] = React.useState(1);
  const [unlockedLevel, setUnlockedLevel] = React.useState(1); // TODO: Load from storage
  const [score, setScore] = React.useState(0); // TODO: Load from storage
  const [resultMessage, setResultMessage] = React.useState<string | null>(null);
  const [feedbackAnimation] = React.useState(new Animated.Value(0));
  const [noteQueue, setNoteQueue] = React.useState<NoteDot[]>([]);
  const [manualDot, setManualDot] = React.useState<NoteDot | null>(null);
  const [currentNote, setCurrentNote] = React.useState<Note | null>(null);
  const [targetNote, setTargetNote] = React.useState<Note | null>(null);
  const [lastCorrectNote, setLastCorrectNote] = React.useState<string | null>(null);
  const [lastIncorrectNote, setLastIncorrectNote] = React.useState<string | null>(null);

  // Screen orientation effect
  React.useEffect(() => {
    async function changeScreenOrientation() {
      if (currentScreen === 'free' || currentScreen === 'campaign') { // Added campaign here as well
        console.log('Locking to LANDSCAPE_RIGHT for game modes (free/campaign)');
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT).catch(e => console.error('Failed to lock game mode orientation:', e));
      } else if (currentScreen === 'menu') {
        console.log('Unlocking orientation for menu screen');
        await ScreenOrientation.unlockAsync().catch(e => console.error('Failed to unlock for menu:', e));
      } else if (currentScreen === 'settings') {
        console.log('Locking to PORTRAIT_UP for settings');
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(e => console.error('Failed to lock settings orientation:', e));
      } else {
        console.log('Unlocking orientation for any other screens');
        await ScreenOrientation.unlockAsync().catch(e => console.error('Failed to unlock orientation for other screens:', e));
      }
    }
    changeScreenOrientation();

    return () => {
      // Attempt to unlock when the screen changes away from game modes or component unmounts
      console.log('Cleaning up orientation lock for:', currentScreen);
      // When the component unmounts or currentScreen changes, 
      // unlock orientation. The next screen's effect will apply its own lock if needed.
      // This simplifies cleanup logic.
      ScreenOrientation.unlockAsync().catch(e => console.error('Failed to unlock orientation on cleanup:', e));
    };
  }, [currentScreen]);

  // Firebase auth listener
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => { // Make async
      setUser(firebaseUser);
      setLoggedIn(!!firebaseUser);
      setAuthChecked(true);
      if (firebaseUser) {
        // User is logged in, try to load their level progress
        const savedLevel = await getUserLevel(firebaseUser.uid);
        if (savedLevel !== null && typeof savedLevel === 'number') {
          console.log("Setting difficulty from saved level:", savedLevel);
          setDifficulty(savedLevel); // This is 0-indexed
          // Optionally, update UI-facing level states if needed
          setCurrentLevel(savedLevel + 1); 
          setSelectedLevel(savedLevel + 1);
          setUnlockedLevel(savedLevel + 1); // Ensure unlocked level reflects saved progress
        } else {
          // No saved progress or invalid data, start at default (difficulty 0 / level 1)
          setDifficulty(0);
          setCurrentLevel(1);
          setSelectedLevel(1);
          setUnlockedLevel(1);
        }
      } else {
        // User is logged out, reset level states if necessary
        setDifficulty(0);
        setCurrentLevel(1);
        setSelectedLevel(1);
        setUnlockedLevel(1);
      }
    });
    return unsubscribe; // Cleanup subscription
  }, []);

 
  // Free mode state (always defined, only used when in free mode)
  const [difficulty, setDifficulty] = React.useState(0);
  const [fretboardHeight, setFretboardHeight] = React.useState(200);
  const [manualMode, setManualMode] = React.useState(false);
  const [manualString, setManualString] = React.useState(0); // First string (High E, 0-indexed, at the top)
  const [manualFret, setManualFret] = React.useState(0);    // First fret
  const [verticalOffset, setVerticalOffset] = React.useState(0); // No additional offset by default
  const [horizontalOffset, setHorizontalOffset] = React.useState(0); // Horizontal offset
  const [noteDot, setNoteDot] = React.useState<NoteDot>(
    manualMode 
      ? ManualDotPositionFunction(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
      : GenDotList(fretboardHeight, strings.length, difficulty)
  );
  const lastCorrectTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const lastIncorrectTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const [numberOfPositions, setNumberOfPositions] = React.useState<number>(30)
  const [selectedLevel, setSelectedLevel] = React.useState<number>(1)
  const [fullList, setFullList] = React.useState<boolean>(true)
  const setLevel = (level: number) => {
    setDifficulty(level - 1);
    setScreen('free');
    setNumberOfPositions(30)
    setScore(0)
    setSelectedLevel(level)
  }

  React.useEffect(() => {
    if (currentScreen === 'free') {
      console.log(`Resetting game for 'free' screen. Campaign Mode: ${campaignMode}, Selected Level: ${selectedLevel}, Difficulty: ${difficulty}`);
      setScore(0);
      setNumberOfPositions(30);
      const currentDifficulty = campaignMode ? selectedLevel - 1 : difficulty;
      setNoteDot(GenDotList(fretboardHeight, strings.length, currentDifficulty < 0 ? 0 : currentDifficulty)); // Ensure difficulty isn't negative
      setNoteQueue([]);
      setLastCorrectNote(null);
      setLastIncorrectNote(null);
      setResultMessage(null);
    }
  }, [currentScreen, campaignMode, selectedLevel, difficulty, fretboardHeight]);

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
  // This useEffect for Firebase auth is being replaced by the one consolidated above.
  // React.useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth as Auth, as Auth, (currentUser) => {
  //     setLoggedIn(!!currentUser)
  //     setAuthChecked(true);
  //   })
  //   return unsubscribe
  // }, [])

  if (!authChecked) {
    // Optionally show a loading spinner here
    return null
  }

  if (!loggedIn) {
    return <LoginScreen onLoginSuccess={() => setLoggedIn(true)} />;
  }

  if (currentScreen === 'campaign'){
    return (
      <Campaign
        onBack={() => setScreen('menu')}
        onLevelSelect={(level) => { setCurrentLevel(level); setSelectedLevel(level); setCampaignMode(true); setScreen('free');}}
        unlockedLevel={unlockedLevel}
        score={score}
      />
    );
  }

  if (currentScreen === 'settings') {
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

  if (currentScreen === 'free') {
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
                      // setSelectedLevel will trigger the useEffect to reset the game for the next level
                      if (selectedLevel < 12) { // Ensure we don't go beyond max level
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
                    setNumberOfPositions(30); // This hides the modal as gameOver becomes false
                    const currentDifficultyForReset = campaignMode ? selectedLevel - 1 : difficulty;
                    setNoteDot(GenDotList(fretboardHeight, strings.length, currentDifficultyForReset < 0 ? 0 : currentDifficultyForReset));
                    setNoteQueue([]); // Clear any queued notes
                    setLastCorrectNote(null); // Clear last correct note feedback
                    setLastIncorrectNote(null); // Clear last incorrect note feedback
                    setResultMessage(null); // Clear any general result message
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
            {/* Reset Button - Always visible during gameplay */}
            <Button
              style={[
                styles.menuButton, // Base style from menuButton for consistency in size/padding
                {
                  minWidth: 80,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  height: undefined,
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const,
                  backgroundColor: palette.notification, // Use notification color for visibility
                  borderColor: palette.primary, // Use primary for border
                  borderWidth: 2,
                  marginLeft: 0, // Override default menuButton margins if any
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
                  styles.menuButtonText, // Base text style
                  {
                    fontSize: 16,
                    color: palette.buttonText, // Use standard button text color
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
                    backgroundColor: themeName === 'rocksmith' ? '#232526' : styles.menuButton.backgroundColor,
                    borderColor: themeName === 'rocksmith' ? '#FFD900' : undefined,
                    borderWidth: themeName === 'rocksmith' ? 2 : 0,
                  },
                ]}
                onPress={() => setScreen('campaign')}
              >
                <Text
                  style={[
                    styles.menuButtonText,
                    {
                      fontSize: 16,
                      color: themeName === 'rocksmith' ? '#FFD900' : styles.menuButtonText.color,
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
                    alignItems: 'center' as const,
                    justifyContent: 'center' as const,
                    backgroundColor: themeName === 'rocksmith' ? '#232526' : styles.menuButton.backgroundColor,
                    borderColor: themeName === 'rocksmith' ? '#FFD900' : undefined,
                    borderWidth: themeName === 'rocksmith' ? 2 : 0,
                  },
                ]}
                onPress={() => setScreen('menu')}
              >
                <Text
                  style={[
                    styles.menuButtonText,
                    {
                      fontSize: 16,
                      color: themeName === 'rocksmith' ? '#FFD900' : styles.menuButtonText.color,
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  Menu
                </Text>
              </Button>
            )}
            {/* Original content of !campaignMode block was an incomplete button, so it's replaced. If other buttons were intended here, they need to be added separately. */}
            {/* The following is a placeholder to ensure the structure is valid if the original !campaignMode block was just an opening. */}
            {false && (
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
                    backgroundColor: themeName === 'rocksmith' ? '#232526' : styles.menuButton.backgroundColor,
                    borderColor: themeName === 'rocksmith' ? '#FFD900' : undefined,
                    borderWidth: themeName === 'rocksmith' ? 2 : 0,
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
                      color: themeName === 'rocksmith' ? '#FFD900' : styles.menuButtonText.color,
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
            backgroundColor: themeName === 'rocksmith' ? '#232526' : '#74512D',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderWidth: themeName === 'rocksmith' ? 2 : 1,
            borderColor: themeName === 'rocksmith' ? '#FFD900' : '#543310',
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            zIndex: 20
          }}>
            <Text style={{ 
              color: themeName === 'rocksmith' ? '#FFD900' : "#F8F4E1", 
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
              position: 'absolute',
              top: 50, 
              left: 0,
              right: 0,
              flexDirection: 'row' as const, 
              flexWrap: 'wrap',    
              justifyContent: 'space-around' as const, 
              alignItems: 'center' as const,
              paddingVertical: 3,  
              paddingHorizontal: 5,
              backgroundColor: 'rgba(175, 143, 111, 0.9)', 
              zIndex: 15, 
              gap: 4, 
            }}>
              <View style={{ alignItems: 'center' as const }}> {/* Manual Mode Toggle */}
                <Text style={{ color: '#543310', marginBottom: 1, fontSize: 10 }}>Manual</Text>
                <View style={{ flexDirection: 'row' as const, alignItems: 'center' as const }}>
                  <Button
                    style={{ backgroundColor: manualMode ? '#543310' : '#74512D', paddingVertical: 4, paddingHorizontal: 6, minWidth: 40 }}
                    onPress={() => {
                      setManualMode(!manualMode);
                      // Update dot position based on new mode
                      setNoteDot(
                        !manualMode 
                          ? ManualDotPositionFunction(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
                          : GenDotList(fretboardHeight, strings.length, difficulty )
                      );
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold', fontSize: 10 }}>{manualMode ? 'On' : 'Off'}</Text>
                  </Button>
                </View>
              </View>
              <View style={{ alignItems: 'center' as const }}> {/* String Controls */}
                <Text style={{ color: '#543310', marginBottom: 1, fontSize: 10 }}>String</Text>
                <View style={{ flexDirection: 'row' as const, alignItems: 'center' as const }}>
                  <Button
                    style={{ backgroundColor: '#74512D', paddingVertical: 4, paddingHorizontal: 8 }}
                    onPress={() => {
                      const newString = Math.max(0, manualString - 1);
                      setManualString(newString);
                      setNoteDot(ManualDotPositionFunction(fretboardHeight, strings.length, newString, manualFret, verticalOffset, horizontalOffset));
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold', fontSize: 12 }}>-</Text>
                  </Button>
                  <Text style={{ color: '#543310', marginHorizontal: 6, fontWeight: 'bold', fontSize: 12 }}>{manualString + 1}</Text>
                  <Button
                    style={{ backgroundColor: '#74512D', paddingVertical: 4, paddingHorizontal: 8 }}
                    onPress={() => {
                      const newString = Math.min(strings.length - 1, manualString + 1);
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
                      const newOffset = verticalOffset - 2 // Move up by 2px
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
                      const newOffset = verticalOffset + 2; // Move down by 2px
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
                      const newOffset = horizontalOffset - 2; // Move left by 2px
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
                      const newOffset = horizontalOffset + 2; // Move right by 2px
                      setHorizontalOffset(newOffset)
                      setNoteDot(ManualDotPositionFunction(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, newOffset))
                    }}
                  >
                    <Text style={{ color: '#F8F4E1', fontWeight: 'bold', fontSize: 12 }}>→</Text>
                  </Button>
                </View>
              </View>
              {/* Inserted Current Note Display */}
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
                    setLastCorrectNote(noteDot[2]); // Always highlight the correct answer for feedback
                    if (lastCorrectTimeout.current) clearTimeout(lastCorrectTimeout.current);
                    lastCorrectTimeout.current = setTimeout(() => setLastCorrectNote(null), 500);

                    // Determine the correct difficulty for note generation based on current mode
                    const currentNoteGenDifficulty = campaignMode 
                      ? (selectedLevel - 1) // 0-indexed difficulty for campaign
                      : difficulty;         // 0-indexed difficulty for free mode
                    
                    // Pre-calculate the next note dot.
                    // manualMode check allows for debugging even during active play if desired.
                    const nextNoteDot = manualMode
                      ? ManualDotPositionFunction(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
                      : GenDotList(fretboardHeight, strings.length, currentNoteGenDifficulty < 0 ? 0 : currentNoteGenDifficulty);

                    if (noteDot[2] === note) { // CORRECT answer
                      ManageResultMessage("✅");
                      setScore(score + 1);
                      setNumberOfPositions(numberOfPositions - 1);
                      setNoteDot(nextNoteDot); // Set the pre-calculated next note
                    } else { // INCORRECT answer
                      setLastIncorrectNote(note); // Highlight the user's incorrect guess
                      if (lastIncorrectTimeout.current) clearTimeout(lastIncorrectTimeout.current);
                      lastIncorrectTimeout.current = setTimeout(() => setLastIncorrectNote(null), 500);
                      
                      ManageResultMessage("❌");
                      setNumberOfPositions(numberOfPositions - 1);
                      setNoteDot(nextNoteDot); // Set the pre-calculated next note (game gives a new note on incorrect)
                    }
                    // Premature level advancement logic removed.
                    // Game will continue until numberOfPositions is 0.
                    // Level completion, unlocking, and advancement are handled by the game over modal logic.
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
  }

  // Profile screen
  if (currentScreen === 'profile') {
    if (!authChecked || !user) {
      // Loading state or if user is null
      return (
        <View style={themeName === 'rocksmith' ? styles.root : { flex: 1, justifyContent: 'center' as const, alignItems: 'center' as const, backgroundColor: '#F8F4E1' }}>
          <Text style={themeName === 'rocksmith' ? { fontSize: 18, color: styles.menuButtonText.color } : { fontSize: 18, color: '#543310' }}>Loading profile...</Text>
        </View>
      );
    }

    return (
      <View style={themeName === 'rocksmith' ? styles.root : { backgroundColor: '#F8F4E1', flex: 1, justifyContent: 'center' as const, alignItems: 'center' as const }}>
        <View style={themeName === 'rocksmith' ?
          [styles.menuButton, { backgroundColor: '#232526', padding: 32, alignItems: 'center' as const, minWidth: 320, maxWidth: 380, marginBottom:0, marginLeft:0, marginRight:0, alignSelf: 'auto' }] 
          :
          {
            backgroundColor: '#E0C097', // Light wood color for the card
            borderRadius: 16,
            padding: 32,
            alignItems: 'center' as const,
            shadowColor: '#000',
            shadowOpacity: 0.10,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 4 },
            elevation: 8,
            minWidth: 320,
            maxWidth: 380,
          }
        }>
          {/* Profile avatar/icon */}
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: themeName === 'rocksmith' ? '#3a3d3e' : '#AF8F6F',
            alignItems: 'center' as const, justifyContent: 'center' as const, marginBottom: 18, borderWidth: 2,
            borderColor: themeName === 'rocksmith' ? (styles.menuButton.borderColor || '#FFD900') : '#74512D',
          }}>
            <Text style={{ fontSize: 40, color: themeName === 'rocksmith' ? (styles.menuButtonText.color || '#FFD900') : '#F8F4E1', fontWeight: 'bold' }}>
              {user?.email ? user.email[0].toUpperCase() : 'U'}
            </Text>
          </View>
          {/* Profile title */}
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: themeName === 'rocksmith' ? (styles.menuButtonText.color || '#FFD900') : '#543310', marginBottom: 10, letterSpacing: 1 }}>User Profile</Text>
          {/* Display name */}
          <Text style={{
            fontSize: 20,
            color: palette.text,
            fontWeight: '600',
            marginBottom: 8,
            backgroundColor: themeName === 'rocksmith' ? 'transparent' : '#F8F4E1',
            paddingVertical: 8, 
            paddingHorizontal: 12, 
            borderRadius: 8,
            textAlign: themeName === 'rocksmith' ? 'center' : 'left', 
            minWidth: 200, 
          }}>
            {user?.displayName || 'No display name set'}
          </Text>
          {/* Email */}
          <Text style={{
            fontSize: 18,
            color: themeName === 'rocksmith' ? '#DDDDDD' : palette.textSecondary,
            fontWeight: '600',
            marginBottom: 24,
            backgroundColor: themeName === 'rocksmith' ? 'transparent' : '#F8F4E1',
            paddingVertical: 8, 
            paddingHorizontal: 12, 
            borderRadius: 8,
            textAlign: themeName === 'rocksmith' ? 'center' : 'left', 
            minWidth: 200, 
          }}>
            {user?.email || 'N/A'}
          </Text>
          <Button
            style={themeName === 'rocksmith' ?
              [styles.menuButton, { width: 180, marginTop: 4, marginBottom: 8, marginLeft:0, marginRight:0, alignSelf: 'auto' }] 
              :
              { backgroundColor: "#74512D", padding: 14, borderRadius: 12, width: 180, marginTop: 4, shadowColor: '#74512D', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }
            }
            onPress={() => {
              Alert.alert(
                'Log out',
                'Are you sure you want to log out?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Log out',
                    style: 'destructive',
                    onPress: async () => {
                      await signOut(auth);
                      setLoggedIn(false);
                      setScreen('menu');
                    }
                  },
                ]
              );
            }}
          >
            <Text style={themeName === 'rocksmith' ? styles.menuButtonText : { color: "#F8F4E1", fontWeight: "bold", fontSize: 18 }}>Logout</Text>
          </Button>
          <Button
            style={themeName === 'rocksmith' ?
              [styles.menuButton, { width: 180, marginTop: 8, marginBottom: 0, marginLeft:0, marginRight:0, alignSelf: 'auto' }] 
              :
              { backgroundColor: "#AF8F6F", padding: 14, borderRadius: 12, width: 180, marginTop: 16, shadowColor: '#74512D', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }
            }
            onPress={() => setScreen('menu')}
          >
            <Text style={themeName === 'rocksmith' ? styles.menuButtonText : { color: "#543310", fontWeight: "bold", fontSize: 18 }}>Back to Menu</Text>
          </Button>
        </View>
      </View>
    );
  }

// ... (rest of the code remains the same)
  // Menu screen
  if (currentScreen === 'menu') {
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
          <View style={{ flexDirection: 'row' as const, gap: 12, marginTop: 16 }}>
            <Button
              style={themeName === 'rocksmith' ? 
                [styles.menuButton, { marginBottom: 0, marginLeft:0, marginRight:0, paddingHorizontal: UI_SIZES.menuButtonPaddingHorizontal / 2, paddingVertical: UI_SIZES.menuButtonPaddingVertical / 2, minWidth: 110 }] 
                : 
                { backgroundColor: "#AF8F6F", padding: 12, borderRadius: 8, minWidth: 110 }
              }
              onPress={() => setScreen('profile')}
            >
              <Text style={themeName === 'rocksmith' ? styles.menuButtonText : { color: "#543310", fontWeight: "bold" }}>Profile</Text>
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

  {/* 
    Fallback or loading state if authChecked is false or no screen matches.
    You might want to render a loading spinner or null here.
  */}
  return null;
}

export default FretboarderAppScreen;