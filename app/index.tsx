import * as React from 'react'
import { View, Text } from 'react-native'
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
}
export const screenOptions = {
  headerShown: false,
};
const frets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const strings = [1, 2, 3, 4, 5, 6];
const NOTE_NAMES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
// Force light mode for the app
const forcedColorScheme = 'light'

export default function Screen() {
  const [progress, setProgress] = React.useState(78)
  const [isLandscape, setIsLandscape] = React.useState(false)
  const [fretboardHeight, setFretboardHeight] = React.useState(200) // default 200px, can be adjusted
  const [showMenu, setShowMenu] = React.useState(true)
  const [showCampaign, setShowCampaign] = React.useState(false)
  const [noteDot, setNoteDot] = React.useState<NoteDot>(GenDotList())
  const [resultMessage, setResultMessage] = React.useState<string | null>(null);
  const [score, setScore] = React.useState(0)
  React.useEffect(() => {
    if (resultMessage) {
      const timeout = setTimeout(() => setResultMessage(null), 1000); // clear after 2s
      return () => clearTimeout(timeout);
    }
  }, [resultMessage]);

  React.useEffect(() => {
    async function checkOrientation() {
      const orientation = await ScreenOrientation.getOrientationAsync()
      console.log('Initial orientation:', orientation)
      setIsLandscape(
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      );
    }
    checkOrientation();
    const subscription = ScreenOrientation.addOrientationChangeListener(event => {
      const orientation = event.orientationInfo.orientation
      console.log('Orientation changed:', orientation)
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
    <View className="flex-1 justify-center items-center bg-white">
      <View className="flex-1 w-full bg-[#FFDDAB] justify-center items-center">
      <Button onPress={() => setShowMenu(true)} style={{ backgroundColor: '#FFD700', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 8, marginBottom: 100 }}>
          <Text style={{ color: "black", fontSize: 15, fontWeight: "bold" }}>Menu</Text>
        </Button>
        <ScoreBoard score={score} />
        {/* Fretboard with frets, strings, and dots */}
        <Fretboard frets={frets} strings={strings} fretboardHeight={fretboardHeight} noteDot={noteDot} />
      </View>
      <View className="h-[20%] justify-center items-center gap-2 p-6 bg-[#48A6A7] w-full">
        {resultMessage && <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>{resultMessage}</Text>}
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
          {NOTE_NAMES.map(note => (
            <Button
              key={note}
              onPress={() => {
                if (noteDot[2] === note) {
                  setNoteDot(GenDotList())
                  setResultMessage("✅ Correct!");   
                  setScore(1+score)
                }
                else {
                  setResultMessage("❌ Incorrect!"); 
                }
              }}
              style={{ margin: 4 }}
            >
              <Text style={{ color: "black", fontWeight: "bold", fontSize: 16 }}>{note}</Text>
            </Button>
          ))}
        </View>
      </View>
    </View>
  );
}

const ScoreBoard: React.FC<ScoreProp> = ({ score }) => {
  return (
    <View style={{ 
      padding: 10, 
      backgroundColor: '#fff', 
      borderRadius: 12, 
      marginTop: 20,
      marginBottom: 100,
      alignItems: 'center',
    }}>
      <Text style={{ 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#333' 
      }}>
        🎯 Score: {score} / 30
      </Text>
    </View>
  )
}