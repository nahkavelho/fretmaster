import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as ScreenOrientation from 'expo-screen-orientation'
import "../app.css";
import Fretboard from "./components/Fretboard"
import Button from "../components/ui/button"
import Menu from "./components/Menu"
import Campaign from "./components/Campaign"
import GenDotList from "./components/DotPositions"
import { NoteDot } from "./components/DotPositions"
import LoginScreen from '../LoginScreen';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

interface ScoreProp {
  score: number
  numberOfPositions: number
}
export const screenOptions = {
  headerShown: false,
};
const frets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const strings = [1, 2, 3, 4, 5, 6];
const NOTE_NAMES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
// Force light mode for the app
const forcedColorScheme = 'light'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F4E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fretboardContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F8F4E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: '#AF8F6F',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 48,
    alignSelf: 'center',
    marginLeft: 50,
    marginRight: 50,
  },
  menuButtonText: {
    color: '#543310',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answerBar: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 24,
    backgroundColor: '#AF8F6F',
    width: '100%',
  },
  resultText: {
    color: '#543310',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  noteButton: {
    margin: 4,
    backgroundColor: '#74512D',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  noteButtonText: {
    color: '#F8F4E1',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default function Screen() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [authChecked, setAuthChecked] = React.useState(false);
  const [screen, setScreen] = React.useState<'menu' | 'campaign' | 'free'>('menu');

  // Free mode state (always defined, only used when in free mode)
  const [fretboardHeight, setFretboardHeight] = React.useState(140);
  const [noteDot, setNoteDot] = React.useState<NoteDot>(GenDotList());
  const [resultMessage, setResultMessage] = React.useState<string | null>(null);
  const [score, setScore] = React.useState(0);
  const [numberOfPositions, setNumberOfPositions] = React.useState(30);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (resultMessage) {
      const timeout = setTimeout(() => setResultMessage(null), 1000);
      return () => clearTimeout(timeout);
    }
  }, [resultMessage]);

  if (!authChecked) {
    // Optionally show a loading spinner here
    return null;
  }

  if (!loggedIn) {
    return <LoginScreen onLoginSuccess={() => setLoggedIn(true)} />;
  }

  if (screen === 'campaign') {
    return <Campaign onBack={() => setScreen('menu')} />;
  }

  if (screen === 'free') {
    return (
      <View style={styles.root}>
        <View style={styles.fretboardContainer}>
          {/* Floating Menu/Reset Buttons - Top Left */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, position: 'absolute', top: 8, left: 8, zIndex: 11 }}>
            <Button style={[styles.menuButton, { minWidth: 80, paddingVertical: 6, paddingHorizontal: 12, height: undefined, alignItems: 'center', justifyContent: 'center' }]} onPress={() => setScreen('menu')}>
              <Text style={[styles.menuButtonText, { fontSize: 16 }]} numberOfLines={1} adjustsFontSizeToFit>{"Menu"}</Text>
            </Button>
            <Button style={[styles.menuButton, { minWidth: 80, paddingVertical: 6, paddingHorizontal: 12, height: undefined, alignItems: 'center', justifyContent: 'center' }]} onPress={() => {
              setNoteDot(GenDotList());
              setResultMessage(null);
              setScore(0);
              setNumberOfPositions(5);
            }}>
              <Text style={[styles.menuButtonText, { fontSize: 16 }]} numberOfLines={1} adjustsFontSizeToFit>{"Reset"}</Text>
            </Button>
          </View>
          {/* Floating Scoreboard - Top Right */}
          <View style={{ alignItems: 'flex-end', marginTop: 0, marginBottom: 8, zIndex: 10, backgroundColor: '#fff', borderRadius: 12, padding: 10, minWidth: 150, position: 'absolute', right: 8, top: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
              {numberOfPositions === 0 ? `Final Score: ${score}` : `Score: ${score} / 30`}
            </Text>
          </View>
          {/* Overlay result message in the middle of the screen */}
          {resultMessage && (
            <View style={{ position: 'absolute', top: '45%', left: 0, right: 0, alignItems: 'center', zIndex: 100 }} pointerEvents="none">
              <Text style={{
                fontSize: 36,
                fontWeight: 'bold',
                color: resultMessage.includes('Correct') ? '#3a7d3a' : '#b22222',
                backgroundColor: 'rgba(255,255,255,0.9)',
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 18,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOpacity: 0.18,
                shadowRadius: 10,
                elevation: 6,
                textAlign: 'center',
              }}>
                {resultMessage}
              </Text>
            </View>
          )}
          {/* Answer bar (note buttons) */}
          <View style={[styles.answerBar, { position: 'absolute', left: 0, right: 0, bottom: 0, margin: 0, borderRadius: 0, zIndex: 20 }]}> 
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 2 }}>
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 16, marginBottom: 2 }}>guess left {numberOfPositions}:</Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: 'center' }}>
              {NOTE_NAMES.map(note => (
                <Button
                  key={note}
                  onPress={() => {
                    if (numberOfPositions === 0) {
                      setResultMessage("No more notes to guess, final score: 0 /" + score);
                      return;
                    }
                    if (noteDot.includes(note)) {
                      setResultMessage(" Correct!");
                      setNoteDot(GenDotList());
                      setScore(score + 1);
                      setNumberOfPositions(numberOfPositions - 1);
                    } else {
                      setResultMessage(" Incorrect!");
                      setNoteDot(GenDotList());
                      setNumberOfPositions(numberOfPositions - 1);
                    }
                  }}
                  style={styles.noteButton}
                >
                  <Text style={styles.noteButtonText}>{note}</Text>
                </Button>
              ))}
            </View>
          </View>
          {/* Fretboard, slightly bigger height for better fit */}
          <View style={{ flexShrink: 1, width: '100%', justifyContent: 'flex-start', alignItems: 'center', marginTop: 40, marginBottom: 20 }}>
            <Fretboard frets={frets} strings={strings} fretboardHeight={170} noteDot={noteDot} />
          </View>
        </View>
      </View>
    );
  }

  // Default to menu
  return (
    <Menu
      onCampaign={() => setScreen('campaign')}
      onFreeMode={() => setScreen('free')}
      onSettings={() => {}}
    />
  );
}