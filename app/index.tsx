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
  const [progress, setProgress] = React.useState(78)
  const [isLandscape, setIsLandscape] = React.useState(false)
  const [fretboardHeight, setFretboardHeight] = React.useState(200) // default 200px, can be adjusted
  const [showMenu, setShowMenu] = React.useState(true)
  const [showCampaign, setShowCampaign] = React.useState(false)
  const [noteDot, setNoteDot] = React.useState<NoteDot>(GenDotList())
  const [resultMessage, setResultMessage] = React.useState<string | null>(null);
  const [score, setScore] = React.useState(0)
  const [numberOfPositions, setNumberOfPositions] = React.useState(5)

  React.useEffect(() => {
    if (resultMessage) {
      const timeout = setTimeout(() => setResultMessage(null), 1000); // clear after 2s
      return () => clearTimeout(timeout);
    }
  }, [resultMessage]);

  React.useEffect(() => {
    async function checkOrientation() {
      const orientation = await ScreenOrientation.getOrientationAsync()
      setIsLandscape(
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      );
    }
    checkOrientation();
    const subscription = ScreenOrientation.addOrientationChangeListener(event => {
      const orientation = event.orientationInfo.orientation
      setIsLandscape(
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      );
    });
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription)
    };
  }, []);

  function updateProgressValue() {

  }
  if (showMenu) {
    return (
      <Menu
        onCampaign={() => { setShowCampaign(true); setShowMenu(false) }}
        onFreeMode={() => setShowMenu(false)}
        onSettings={() => { /* TODO: Implement settings screen */ }}
      />
    );
  }

  if (showCampaign) {
    return (
      <Campaign onBack={() => { setShowCampaign(false); setShowMenu(true) }} />
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.fretboardContainer}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>  
        <Button style={styles.menuButton} onPress={() => setShowMenu(true)}>
          <Text style={styles.menuButtonText}>Menu</Text>
        </Button>
        <Button style={styles.menuButton} onPress={() => {
          setNoteDot(GenDotList())
          setResultMessage(null)
          setScore(0)
          setNumberOfPositions(5)
        }}
        >
          <Text style={styles.menuButtonText}>Reset</Text>
        </Button>
      </View>
        <ScoreBoard score={score} numberOfPositions={numberOfPositions} />
        {/* Fretboard with frets, strings, and dots */}
        <Fretboard frets={frets} strings={strings} fretboardHeight={fretboardHeight} noteDot={noteDot} />
      </View>
      <View style={styles.answerBar}>
        {resultMessage && <Text style={styles.resultText}>{resultMessage}</Text>}
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
          <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>guess left {numberOfPositions}: </Text>
          {NOTE_NAMES.map(note => (
            <Button
              key={note}
              onPress={() => {
                if (numberOfPositions === 0) {
                  setResultMessage("No more notes to guess, final score: 0 /" + score)
                  return
                }

                if (noteDot.includes(note)) {
                  setResultMessage("✅ Correct!");
                  setNoteDot(GenDotList())
                  setScore(score+1)
                  setNumberOfPositions(numberOfPositions-1)
                }
                else {
                  setResultMessage("❌ Incorrect!"); 
                  setNoteDot(GenDotList())
                  setNumberOfPositions(numberOfPositions-1)
                }
              }}
              style={styles.noteButton}
            >
              <Text style={styles.noteButtonText}>{note}</Text>
            </Button>
          ))}
        </View>
      </View>
    </View>
  );
}

const ScoreBoard: React.FC<ScoreProp> = ({ score, numberOfPositions }) => {
  const isFinal = numberOfPositions === 0;

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 100,
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        {isFinal ? `Final Score: ${score}` : `Score: ${score} / 30`}
      </Text>
    </View>
  )
}