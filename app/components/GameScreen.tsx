import * as React from 'react';
import { View, Text, Alert, ViewStyle, TextStyle, Animated, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
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
  // UI_SIZES is imported directly
}

const GameScreen: React.FC<GameScreenProps> = ({
  styles,
  themeName,
  palette,
  currentScreen,
  setScreen,
  loggedIn,
  user,
  authChecked,
  campaignMode,
  setCampaignMode,
  currentLevel,
  setCurrentLevel,
  selectedLevel,
  setSelectedLevel,
  unlockedLevel,
  setUnlockedLevel,
  score,
  setScore,
  resultMessage,
  setResultMessage,
  feedbackAnimation,
  noteQueue,
  setNoteQueue,
  manualDot,
  setManualDot,
  manualMode,
  setManualMode,
  manualString,
  setManualString,
  manualFret,
  setManualFret,
  currentNote,
  setCurrentNote,
  targetNote,
  setTargetNote,
  lastCorrectNote,
  setLastCorrectNote,
  lastIncorrectNote,
  setLastIncorrectNote,
  ALL_CHROMATIC_NOTES_ORDERED,
  frets,
  strings,
  fretboardHeight,
  noteDot,
  setNoteDot,
  difficulty,
  setDifficulty,
  verticalOffset,
  setVerticalOffset,
  horizontalOffset,
  setHorizontalOffset,
  numberOfPositions,
  setNumberOfPositions,
  ManageResultMessage,
}) => {
  const { width, height } = Dimensions.get('window');
  const shortDim = Math.min(width, height);
  const isCompact = shortDim < 360;
  const answerBarHeight = Math.max(80, Math.min(Math.round(height * 0.24), 160));
  const noteBtnPaddingV = isCompact ? 6 : 10;
  const noteBtnPaddingH = isCompact ? 10 : 14;
  const noteBtnMinWidth = isCompact ? 44 : 56;
  const noteBtnMinHeight = isCompact ? 40 : 48;
  const noteBtnBorderRadius = isCompact ? 10 : 12;
  const noteFontSize = isCompact ? 14 : 18;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const statusBarHeight = isCompact ? 28 : 38;

  const correctSound = React.useRef<Audio.Sound | null>(null);
  const wrongSound = React.useRef<Audio.Sound | null>(null);
  const levelPassSound = React.useRef<Audio.Sound | null>(null);
  const levelLoseSound = React.useRef<Audio.Sound | null>(null);
  const lastCorrectTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const lastIncorrectTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const streakSound = React.useRef<Audio.Sound | null>(null);
  const [levelEndSoundPlayed, setLevelEndSoundPlayed] = React.useState(false);
  const [combo, setCombo] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);
  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const getTimePerGuess = React.useCallback(() => {
    if (!campaignMode) return null; // Timer only active in campaign as requested
    if (selectedLevel >= 1 && selectedLevel <= 12) return 8; // Beginner
    if (selectedLevel >= 13 && selectedLevel <= 24) return 5; // Intermediate
    if (selectedLevel >= 25 && selectedLevel <= 36) return 3; // Advanced
    return 8; // Default safety
  }, [campaignMode, selectedLevel]);

  const clearGuessTimer = React.useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimeLeft(null);
  }, []);

  const startGuessTimer = React.useCallback(() => {
    const duration = getTimePerGuess();
    clearGuessTimer();
    if (!duration || numberOfPositions === 0) return;
    setTimeLeft(duration);
    const startedAt = Date.now();
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = duration - elapsed;
      if (remaining <= 0) {
        clearGuessTimer();
        // Auto mark as wrong and advance to next
        (async () => {
          try {
            if (wrongSound.current) {
              await wrongSound.current.replayAsync();
            }
          } catch {}
          ManageResultMessage("⏰ Time up!");
          // Generate next note (respect not repeating same note name)
          const currentNoteGenDifficulty = campaignMode 
            ? (selectedLevel - 1)
            : difficulty;
          const difficultyForGen = currentNoteGenDifficulty < 0 ? 0 : currentNoteGenDifficulty;
          let generated = GenDotList(fretboardHeight, strings.length, difficultyForGen);
          let attempts = 0;
          while (generated[2] === noteDot[2] && attempts < 10) {
            generated = GenDotList(fretboardHeight, strings.length, difficultyForGen);
            attempts++;
          }
          setNumberOfPositions(Math.max(0, numberOfPositions - 1));
          setNoteDot(generated);
          setCombo(0);
        })();
      } else {
        setTimeLeft(remaining);
      }
    }, 250);
  }, [getTimePerGuess, numberOfPositions, ManageResultMessage, campaignMode, selectedLevel, difficulty, fretboardHeight, strings.length, noteDot, clearGuessTimer, setNumberOfPositions, setNoteDot]);

  // Define gameOver early so effects can depend on it without use-before-declare
  const gameOver = numberOfPositions === 0;

  React.useEffect(() => {
    let isMounted = true;
    async function loadSounds() {
      try {
        const { sound: correct } = await Audio.Sound.createAsync(
          require('../../assets/sounds/correct.wav')
        );
        const { sound: wrong } = await Audio.Sound.createAsync(
          require('../../assets/sounds/wrong.wav')
        );
        if (isMounted) {
          correctSound.current = correct;
          wrongSound.current = wrong;

        const { sound: pass } = await Audio.Sound.createAsync(
          require('../../assets/sounds/leveloverpass.wav')
        );
        levelPassSound.current = pass;

        const { sound: lose } = await Audio.Sound.createAsync(
          require('../../assets/sounds/leveloverlose.wav')
        );
        levelLoseSound.current = lose;
        // Load streak sound
        const { sound: streak } = await Audio.Sound.createAsync(
          require('../../assets/sounds/streak.wav')
        );
        streakSound.current = streak;
        }
      } catch (e) {
        console.warn('Failed to load sounds', e);
      }
    }
    loadSounds();
    return () => {
      isMounted = false;
      if (correctSound.current) {
        correctSound.current.unloadAsync();
      }
      if (wrongSound.current) {
        wrongSound.current?.unloadAsync();
      }
      levelPassSound.current?.unloadAsync();
      levelLoseSound.current?.unloadAsync();
      streakSound.current?.unloadAsync();
      clearGuessTimer();
    };
  }, [clearGuessTimer]);

  // Restart timer whenever a new note is shown, or when campaign timing tier changes
  React.useEffect(() => {
    if (gameOver) {
      clearGuessTimer();
      return;
    }
    startGuessTimer();
    return () => {
      // Interval cleared by start/clear helpers
    };
  }, [noteDot, campaignMode, selectedLevel, gameOver, startGuessTimer, clearGuessTimer]);

  // Effect to handle level completion
  React.useEffect(() => {
    if (numberOfPositions === 0 && !levelEndSoundPlayed) {
      // Ensure sounds are loaded and available
      if (levelPassSound.current || levelLoseSound.current) {
        if (score >= 27) {
          playLevelEndSound(true);
          ManageResultMessage("🎉 Level Passed! 🎉");
          if (campaignMode && user && selectedLevel === unlockedLevel) {
            const newUnlockedLevel = unlockedLevel + 1;
            setUnlockedLevel(newUnlockedLevel);
            if (user.uid) { // Ensure user.uid is available
              saveUserLevel(user.uid, newUnlockedLevel); // saveUserLevel is imported directly
            }
          }
        } else {
          playLevelEndSound(false);
          ManageResultMessage("💔 Level Failed 💔");
        }
        setLevelEndSoundPlayed(true); // Set the flag after playing the sound
        // Optionally, navigate away or disable further interactions after a delay
        // const timer = setTimeout(() => {
        //   if (currentScreen === 'Game') { // Check if still on game screen
        //      setScreen(campaignMode ? 'LevelSelectScreen' : 'MainMenuScreen'); // Use actual screen names
        //   }
        // }, 3000);
        // return () => clearTimeout(timer);
      }
    }
  }, [numberOfPositions, score, campaignMode, user, selectedLevel, unlockedLevel, setUnlockedLevel, ManageResultMessage, currentScreen, setScreen]); // Dependencies for level completion logic

  const playSound = async (isCorrect: boolean) => {
    try {
      if (isCorrect && correctSound.current) {
        await correctSound.current.replayAsync();
      } else if (!isCorrect && wrongSound.current) {
        await wrongSound.current.replayAsync();
      }
    } catch (e) {
      // Ignore sound errors
    }
  };

  const playLevelEndSound = async (didPass: boolean) => {
    try {
      if (didPass && levelPassSound.current) {
        await levelPassSound.current.replayAsync();
      } else if (!didPass && levelLoseSound.current) {
        await levelLoseSound.current.replayAsync();
      }
    } catch (error) {
      console.error("Error playing level end sound", error);
    }
  };

  // Play special streak cue at 5/10/20 using streak.wav (fallback to correct.wav)
  const playStreakCue = async (count: number) => {
    try {
      if (count === 5 || count === 10 || count === 20) {
        if (streakSound.current) {
          await streakSound.current.replayAsync();
        } else if (correctSound.current) {
          await correctSound.current.replayAsync();
        }
      }
    } catch {}
  };

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
    if (campaignMode && score >= 27 && selectedLevel === unlockedLevel && unlockedLevel < 36) {
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
      <View style={[
        styles.fretboardContainer,
        themeName === 'rocksmith' && { backgroundColor: '#181A1B' },
        { paddingBottom: answerBarHeight + 12, paddingTop: statusBarHeight + 8 }
      ]}>
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
              {score >= 27 && selectedLevel < 36 && (
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
                    if (selectedLevel < 36) {
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
                  setLevelEndSoundPlayed(false); // Reset flag for new game
                  // Optionally, navigate away or disable further interactions after a delay
                  // const timer = setTimeout(() => {
                  //   if (currentScreen === 'Game') { // Check if still on game screen
                  //      setScreen(campaignMode ? 'LevelSelectScreen' : 'MainMenuScreen'); // Use actual screen names
                  //   }
                  // }, 3000);
                  // return () => clearTimeout(timer);
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
                  setLevelEndSoundPlayed(false); // Reset flag when going back to menu
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
        {/* Single compact menu button and dropdown */}
        <View style={{ position: 'absolute', top: 8, right: 8, zIndex: 12 }}>
          <Button
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              paddingVertical: 0,
              paddingHorizontal: 0,
              alignItems: 'center' as const,
              justifyContent: 'center' as const,
            }}
            onPress={() => setMenuOpen((v) => !v)}
          >
            <Text style={{ color: palette.buttonText, fontWeight: 'bold', fontSize: 16 }}>☰</Text>
          </Button>

          {menuOpen && (
            <View style={{
              position: 'absolute',
              top: 40,
              right: 0,
              backgroundColor: palette.card,
              borderColor: palette.primary,
              borderWidth: 2,
              borderRadius: 12,
              paddingVertical: 8,
              paddingHorizontal: 8,
              gap: 6,
              minWidth: 150,
              shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6,
            }}>
              <Button
                style={{ paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 }}
                onPress={() => {
                  setMenuOpen(false);
                  setScore(0);
                  setNumberOfPositions(30);
                  const currentDifficultyForReset = campaignMode ? selectedLevel - 1 : difficulty;
                  setNoteDot(GenDotList(fretboardHeight, strings.length, currentDifficultyForReset < 0 ? 0 : currentDifficultyForReset));
                  setNoteQueue([]);
                  setLastCorrectNote(null);
                  setLastIncorrectNote(null);
                  setResultMessage(null);
                  setCombo(0);
                }}
              >
                <Text style={{ color: palette.buttonText, fontWeight: 'bold' }}>Reset</Text>
              </Button>

              {campaignMode && (
                <Button
                  style={{ paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 }}
                  onPress={() => { setMenuOpen(false); setScreen('campaign'); setCampaignMode(false); setCombo(0); }}
                >
                  <Text style={{ color: palette.text, fontWeight: 'bold' }}>Levels</Text>
                </Button>
              )}

              <Button
                style={{ paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 }}
                onPress={() => { setMenuOpen(false); setScreen('settings'); setCombo(0); }}
              >
                <Text style={{ color: palette.text, fontWeight: 'bold' }}>Settings</Text>
              </Button>

              <Button
                style={{ paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 }}
                onPress={() => { setMenuOpen(false); setScreen('menu'); setCombo(0); }}
              >
                <Text style={{ color: palette.text, fontWeight: 'bold' }}>Menu</Text>
              </Button>
            </View>
          )}
        </View>

        {/* Score and Level Display - Centered Top (space reserved via paddingTop) */}
        <View style={{ alignItems: 'center' as const, position: 'absolute', top: 8, left: 8, right: 8, zIndex: 9 }}>
          <Text
            style={{ color: palette.text, fontWeight: 'bold', fontSize: isCompact ? 14 : 18, textAlign: 'center' as const }}
            numberOfLines={2}
          >
            {campaignMode ? `Level: ${selectedLevel} | ` : ''}Guesses: {30 - numberOfPositions}/30 | Score: {score} | Combo: {combo}{campaignMode && timeLeft !== null ? ` | Time: ${timeLeft}s` : ''}
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
        <View style={[styles.answerBar, { position: 'absolute', left: 0, right: 0, bottom: 0, margin: 0, borderRadius: 0, zIndex: 20, height: answerBarHeight, padding: isCompact ? 16 : 24, borderTopWidth: 0, borderColor: 'transparent' }]}> 
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: 'center' as const }}>
            {ALL_CHROMATIC_NOTES_ORDERED.map((note: string)  => (
              <Button
                disabled={numberOfPositions === 0}
                key={note}
                style={[
                  {
                    paddingVertical: noteBtnPaddingV,
                    paddingHorizontal: noteBtnPaddingH,
                    minWidth: noteBtnMinWidth,
                    minHeight: noteBtnMinHeight,
                    borderRadius: noteBtnBorderRadius,
                    margin: 6,
                  },
                  lastCorrectNote === note ? { backgroundColor: '#2ecc40', borderWidth: 2, borderColor: '#145a1f' } : null,
                  lastIncorrectNote === note ? { backgroundColor: '#ff5555', borderWidth: 2, borderColor: '#a10000' } : null,
                ]}
                onPress={async () => {
                  // User answered: cancel timer for this guess
                  clearGuessTimer();
                  setLastCorrectNote(noteDot[2]);
                  if (lastCorrectTimeout.current) clearTimeout(lastCorrectTimeout.current);
                  lastCorrectTimeout.current = setTimeout(() => setLastCorrectNote(null), 500);

                  const currentNoteGenDifficulty = campaignMode 
                    ? (selectedLevel - 1)
                    : difficulty;
                  
                  const nextNoteDot = manualMode
                    ? ManualDotPositionFunction(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
                    : (() => {
                        // Prevent the same note name from appearing twice in a row
                        const difficultyForGen = currentNoteGenDifficulty < 0 ? 0 : currentNoteGenDifficulty;
                        let generated = GenDotList(fretboardHeight, strings.length, difficultyForGen);
                        let attempts = 0;
                        while (generated[2] === noteDot[2] && attempts < 10) {
                          generated = GenDotList(fretboardHeight, strings.length, difficultyForGen);
                          attempts++;
                        }
                        return generated;
                      })();

                  if (noteDot[2] === note) {
                    const newCombo = combo + 1;
                    setCombo(newCombo);
                    await playSound(true);
                    ManageResultMessage("✅");
                    setScore(score + 1);
                    setNumberOfPositions(numberOfPositions - 1);
                    setNoteDot(nextNoteDot);
                    if (newCombo === 5 || newCombo === 10 || newCombo === 20) {
                      ManageResultMessage(`🔥 Streak x${newCombo}!`);
                      await playStreakCue(newCombo);
                    }
                    // Start timer for next note
                    startGuessTimer();
                  } else {
                    setLastIncorrectNote(note);
                    if (lastIncorrectTimeout.current) clearTimeout(lastIncorrectTimeout.current);
                    lastIncorrectTimeout.current = setTimeout(() => setLastIncorrectNote(null), 500);
                    await playSound(false);
                    ManageResultMessage("❌");
                    setNumberOfPositions(numberOfPositions - 1);
                    setNoteDot(nextNoteDot);
                    setCombo(0);
                    // Start timer for next note
                    startGuessTimer();
                  }
                }}
              >
                <Text style={{ color: palette.buttonText, fontWeight: 'bold', fontSize: noteFontSize }}>
                  {note}
                </Text>
              </Button>
            ))}
          </View>
        </View>
        {/* Fretboard, slightly bigger height for better fit */}
        <View style={{ flexShrink: 1, width: '100%', justifyContent: 'flex-start', alignItems: 'center' as const, marginTop: 6, marginBottom: 0 }}>
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
