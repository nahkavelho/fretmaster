import * as React from 'react';
import { useRouter } from 'expo-router'; // Removed Stack and Screen as ExpoRouterScreen
// import * as ScreenOrientation from 'expo-screen-orientation'; // Functionality moved to useScreenOrientation hook
import { View, Text, StyleSheet, Animated, Alert, ViewStyle, TextStyle, Dimensions } from 'react-native';

import Fretboard from "./components/Fretboard";
import Button from "../components/ui/button";
import Menu from "./components/Menu";
import Campaign from "./components/Campaign";
import GenDotList, { ManualDotPosition as ManualDotPositionFunction } from "./components/DotPositions";
import { NoteDot, Note } from "./components/DotPositions";
import LoginScreen from '../LoginScreen';
import { getAuth, onAuthStateChanged, User as FirebaseUser, signOut, Auth } from 'firebase/auth'; // Added FirebaseUser for clarity
import { auth, getUserLevel, saveUserLevel, getLevelScores, getUserStats, resetProgress } from "../firebase"; // Add stats and reset APIs
import Settings from "./components/Settings";
import { ThemeContext, ThemeName, ThemePalette } from './ThemeContext';
import { UI_SIZES } from './components/uiConstants';
import { getGlobalStyles } from './components/globalStyles';
import { useScreenOrientation } from './components/useScreenOrientation';
import AnimatedFeedback from './components/AnimatedFeedback';
import MenuScreen from './components/MenuScreen';
import ProfileScreen from './components/ProfileScreen';
import GameScreen from './components/GameScreen';
import FretboardReference from './components/FretboardReference';

const frets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const strings = [1, 2, 3, 4, 5, 6]
// Force light mode for the app



export function FretboarderAppScreen() {
  const ALL_CHROMATIC_NOTES_ORDERED = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
  const { themeName, setThemeName, palette } = React.useContext(ThemeContext);



  const styles = getGlobalStyles(themeName, palette);
  const [currentScreen, setScreen] = React.useState('menu'); // 'menu', 'free', 'campaign', 'settings', 'profile'
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [authChecked, setAuthChecked] = React.useState(false);
  const [campaignMode, setCampaignMode] = React.useState(false);
  const [currentLevel, setCurrentLevel] = React.useState(1);
  const [unlockedLevel, setUnlockedLevel] = React.useState(1); // TODO: Load from storage
  const [score, setScore] = React.useState(0); // TODO: Load from storage
  const [bestScores, setBestScores] = React.useState<Record<string, number>>({});
  const [resultMessage, setResultMessage] = React.useState<string | null>(null);
  const [feedbackAnimation] = React.useState(new Animated.Value(0));
  const [noteQueue, setNoteQueue] = React.useState<NoteDot[]>([]);
  const [manualDot, setManualDot] = React.useState<NoteDot | null>(null);
  const [currentNote, setCurrentNote] = React.useState<Note | null>(null);
  const [targetNote, setTargetNote] = React.useState<Note | null>(null);
  const [lastCorrectNote, setLastCorrectNote] = React.useState<string | null>(null);
  const [lastIncorrectNote, setLastIncorrectNote] = React.useState<string | null>(null);

  useScreenOrientation(currentScreen);

  

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
        // Load best scores map
        try {
          const scores = await getLevelScores(firebaseUser.uid);
          setBestScores(scores || {});
        } catch (e) {
          setBestScores({});
        }
        // Load user stats
        try {
          const stats = await getUserStats(firebaseUser.uid);
          setUserStats(stats || { totalTimeSeconds: 0, bestStreak: 0, recentSessions: [] });
        } catch (e) {
          setUserStats({ totalTimeSeconds: 0, bestStreak: 0, recentSessions: [] });
        }
      } else {
        // User is logged out, reset level states if necessary
        setDifficulty(0);
        setCurrentLevel(1);
        setSelectedLevel(1);
        setUnlockedLevel(1);
        setBestScores({});
      }
    });
    return unsubscribe; // Cleanup subscription
  }, []);

 
  // Free mode state (always defined, only used when in free mode)
  const [difficulty, setDifficulty] = React.useState(0);
  const calcFretboardHeight = React.useCallback((screenName: string) => {
    const { width, height } = Dimensions.get('window');
    const isLandscape = width > height;
    // In free/game mode we lock to landscape, so base height as a proportion of window height.
    // In other screens, keep a conservative size.
    if (screenName === 'free') {
      const target = Math.round(height * 0.68); // 68% of viewport height in landscape
      return Math.max(160, Math.min(target, 420)); // clamp
    }
    const target = Math.round(height * 0.42);
    return Math.max(140, Math.min(target, 360));
  }, []);

  const [fretboardHeight, setFretboardHeight] = React.useState(() => calcFretboardHeight('menu'));

  const [manualMode, setManualMode] = React.useState(false);
  const [manualString, setManualString] = React.useState(0); // First string (High E, 0-indexed, at the top)
  const [manualFret, setManualFret] = React.useState(0);    // First fret
  const [verticalOffset, setVerticalOffset] = React.useState(0); // No additional offset by default
  const [horizontalOffset, setHorizontalOffset] = React.useState(0); // Horizontal offset
  const [noteDot, setNoteDot] = React.useState<NoteDot>(
    manualMode 
      ? ManualDotPositionFunction(fretboardHeight, strings.length, manualString, manualFret, verticalOffset, horizontalOffset)
      : GenDotList(fretboardHeight, strings.length, 0) // Always start with difficulty 0 (level 1) for initial state
  );
  const lastCorrectTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const lastIncorrectTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const [numberOfPositions, setNumberOfPositions] = React.useState<number>(30)
  const [selectedLevel, setSelectedLevel] = React.useState<number>(1)
  const [fullList, setFullList] = React.useState<boolean>(true)
  const [freeModeTimeSeconds, setFreeModeTimeSeconds] = React.useState<number | null>(null)
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(true)
  const [hapticsEnabled, setHapticsEnabled] = React.useState<boolean>(true)
  const [useColoredStrings, setUseColoredStrings] = React.useState<boolean>(false) // Steel strings by default
  const [userStats, setUserStats] = React.useState<{ totalTimeSeconds: number; bestStreak: number; recentSessions: any[] }>({ totalTimeSeconds: 0, bestStreak: 0, recentSessions: [] })
  const resultClearTimeout = React.useRef<NodeJS.Timeout | null>(null)
  const latestResultMessageRef = React.useRef<string | null>(null)
  const setLevel = (level: number) => {
    setDifficulty(level - 1);
    setScreen('free');
    setNumberOfPositions(30)
    setScore(0)
    setSelectedLevel(level)
  }

  // Effect to set fretboard height when entering game screen
  React.useEffect(() => {
    if (currentScreen === 'free') {
      const newFretboardHeight = calcFretboardHeight('free');
      setFretboardHeight(newFretboardHeight);
    }
  }, [currentScreen, calcFretboardHeight]);

  // Effect to reset game state when entering free mode or when level/difficulty changes
  React.useEffect(() => {
    if (currentScreen === 'free') {
      console.log(`Resetting game for 'free' screen. Campaign Mode: ${campaignMode}, Selected Level: ${selectedLevel}, Difficulty: ${difficulty}, Fretboard Height: ${fretboardHeight}`);
      setScore(0);
      setNumberOfPositions(30);
      const currentDifficulty = campaignMode ? selectedLevel - 1 : difficulty;
      setNoteDot(GenDotList(fretboardHeight, strings.length, currentDifficulty < 0 ? 0 : currentDifficulty));
      setNoteQueue([]);
      setLastCorrectNote(null);
      setLastIncorrectNote(null);
      setResultMessage(null);
    }
  }, [currentScreen, campaignMode, selectedLevel, difficulty, fretboardHeight, strings.length]);

  // Update fretboard height on dimension changes to fit different phones
  React.useEffect(() => {
    const handler = ({ window }: { window: { width: number; height: number } }) => {
      setFretboardHeight(calcFretboardHeight(currentScreen));
    };
    const subscription = Dimensions.addEventListener('change', handler);
    return () => {
      if (typeof (subscription as any)?.remove === 'function') {
        (subscription as any).remove();
      }
      // If on a very old RN where addEventListener doesn't return a subscription, there's nothing to remove.
    };
  }, [currentScreen, calcFretboardHeight]);

  const ManageResultMessage = (message: string) => {
    // Cancel any pending result clear to avoid wiping a newer message (e.g., streak) prematurely
    if (resultClearTimeout.current) {
      clearTimeout(resultClearTimeout.current)
      resultClearTimeout.current = null
    }

    const incomingIsQuick = (message === '✅' || message === '❌')
    const currentIsQuick = (latestResultMessageRef.current === '✅' || latestResultMessageRef.current === '❌')

    // If a non-quick (e.g., streak) message is currently visible, ignore quick updates to avoid cutting it short
    if (!currentIsQuick && latestResultMessageRef.current) {
      if (incomingIsQuick) {
        return; // keep showing the longer message
      }
    }

    setResultMessage(message)
    latestResultMessageRef.current = message

    // Only auto-clear quick emoji messages. Streak/text messages are faded by AnimatedFeedback.
    if (incomingIsQuick) {
      resultClearTimeout.current = setTimeout(() => {
        // Only clear if the current message is still a quick one.
        if (latestResultMessageRef.current === '✅' || latestResultMessageRef.current === '❌') {
          setResultMessage(null)
          latestResultMessageRef.current = null
        }
        resultClearTimeout.current = null
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
        bestScores={bestScores}
      />
    );
  }

  if (currentScreen === 'settings') {
    return (
      <Settings
        onBack={() => setScreen('menu')}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        hapticsEnabled={hapticsEnabled}
        setHapticsEnabled={setHapticsEnabled}
        useColoredStrings={useColoredStrings}
        setUseColoredStrings={setUseColoredStrings}
      />
    )
  }

  if (currentScreen === 'reference') {
    return (
      <FretboardReference
        onBack={() => setScreen('menu')}
      />
    )
  }

  if (currentScreen === 'free') {
    return (
      <GameScreen
        styles={styles}
        themeName={themeName}
        palette={palette}
        currentScreen={currentScreen}
        setScreen={setScreen}
        loggedIn={loggedIn}
        user={user}
        authChecked={authChecked}
        campaignMode={campaignMode}
        setCampaignMode={setCampaignMode}
        currentLevel={currentLevel}
        setCurrentLevel={setCurrentLevel}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        unlockedLevel={unlockedLevel}
        setUnlockedLevel={setUnlockedLevel}
        score={score}
        setScore={setScore}
        resultMessage={resultMessage}
        setResultMessage={setResultMessage}
        feedbackAnimation={feedbackAnimation}
        noteQueue={noteQueue}
        setNoteQueue={setNoteQueue}
        manualDot={manualDot}
        setManualDot={setManualDot}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        targetNote={targetNote}
        setTargetNote={setTargetNote}
        lastCorrectNote={lastCorrectNote}
        setLastCorrectNote={setLastCorrectNote}
        lastIncorrectNote={lastIncorrectNote}
        setLastIncorrectNote={setLastIncorrectNote}
        ALL_CHROMATIC_NOTES_ORDERED={ALL_CHROMATIC_NOTES_ORDERED}
        frets={frets}
        strings={strings}
        fretboardHeight={fretboardHeight}
        noteDot={noteDot!}
        setNoteDot={setNoteDot}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        manualMode={manualMode}
        setManualMode={setManualMode}
        manualString={manualString}
        setManualString={setManualString}
        manualFret={manualFret}
        setManualFret={setManualFret}
        verticalOffset={verticalOffset}
        setVerticalOffset={setVerticalOffset}
        horizontalOffset={horizontalOffset}
        setHorizontalOffset={setHorizontalOffset}
        numberOfPositions={numberOfPositions}
        setNumberOfPositions={setNumberOfPositions}
        ManageResultMessage={ManageResultMessage}
        // Best scores state
        bestScores={bestScores}
        setBestScores={setBestScores}
        freeModeTimeSeconds={freeModeTimeSeconds}
        useColoredStrings={useColoredStrings}
      />
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
      <ProfileScreen 
        themeName={themeName}
        palette={palette}
        styles={styles}
        user={user}
        auth={auth} // Pass the auth instance from firebase.ts
        setLoggedIn={setLoggedIn}
        setScreen={setScreen}
        bestScores={bestScores}
        unlockedLevel={unlockedLevel}
        userStats={userStats}
        setUnlockedLevel={setUnlockedLevel}
        onResetProgress={async () => {
          if (!user) return;
          try {
            await resetProgress(user.uid);
            setUnlockedLevel(1);
            setBestScores({});
            setUserStats({ totalTimeSeconds: 0, bestStreak: 0, recentSessions: [] });
          } catch (e) {
            // Optionally show an alert
          }
        }}
      />
    );
  }

// ... (rest of the code remains the same)
  // Menu screen
  if (currentScreen === 'menu') {
    return (
      <MenuScreen 
        setScreen={(screenName: string, campaign?: boolean) => {
          setScreen(screenName);
          if (typeof campaign !== 'undefined') {
            setCampaignMode(campaign);
          }
        }}
        styles={styles}
        themeName={themeName}
        palette={palette} // Pass palette to MenuScreen
        onStartFreeMode={(level: number, timeSeconds: number | null) => {
          // level is 0-12 per modal selection
          setCampaignMode(false);
          setDifficulty(level);
          setFreeModeTimeSeconds(timeSeconds);
          setScreen('free');
        }}
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