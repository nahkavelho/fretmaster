import React from "react"
import Frets from "./Frets"
import Strings from "./Strings"
import FretDots from "./FretDots"
import { View, Animated } from "react-native" // Import Animated
import { Dimensions } from 'react-native'

interface FretboardProps {
  frets: number[]
  strings: number[]
  fretboardHeight: number
  noteDot: [x: number, y: number, note: string, stringIndex: number, fretIndex: number]
  difficulty: number
  themeName: ThemeName
  palette: ThemePalette
  useColoredStrings: boolean
}

interface DrawNoteDotProps {
  noteDot: [x: number, y: number, note: string, stringIndex: number, fretIndex: number]
  themeName: ThemeName
  palette: ThemePalette
}

import { ThemeName, ThemePalette } from '../ThemeContext';

const Fretboard: React.FC<FretboardProps> = ({ frets, strings, fretboardHeight, noteDot, difficulty, themeName, palette, useColoredStrings }) => {

  const max_difficulty = 12;
  const screenWidth = Dimensions.get('window').width;
  const percent = Math.min(100, Math.max(0, (difficulty / max_difficulty) * 100));
  const usedWidth = (percent / 100) * screenWidth;
  const bgColor = palette.fretboardBackground;
  const borderColor = palette.fretboardBorder;
  const nutColor = palette.fretboardNut;
  return (
    <View style={{ position: 'relative', width: '100%', height: fretboardHeight, backgroundColor: bgColor, borderRadius: 16, borderWidth: 4, borderColor: borderColor }}>
      {/* Frets (vertical lines) - render first so they're behind */}
      <Frets frets={frets} />
      {/* Dots (fretboard inlay dots) */}
      <FretDots frets={frets} fretboardHeight={fretboardHeight} />
      {/* Strings (horizontal lines) - render on top of frets */}
      <Strings strings={strings} fretboardHeight={fretboardHeight} themeName={themeName} stringColors={palette.stringColors} palette={palette} useColoredStrings={useColoredStrings} />
      {/* Random note dots - render last, on top of everything */}
      <DrawNoteDot noteDot={noteDot} themeName={themeName} palette={palette} />
    </View>
  )
}

const DrawNoteDot: React.FC<DrawNoteDotProps> = ({ noteDot, themeName, palette }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current; // Animated value for scaling

  React.useEffect(() => {
    if (noteDot) { // Only animate if noteDot exists
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.25, // Scale up
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1, // Scale down
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    // Cleanup animation on component unmount or if noteDot becomes null
    return () => {
      scaleAnim.setValue(1); // Reset scale
      // Consider stopping the animation explicitly if Animated.loop doesn't handle it well on cleanup
      // For instance, by keeping a reference to the animation and calling .stop()
    };
  }, [noteDot, scaleAnim]); // Rerun effect if noteDot changes

  if (!noteDot) {
    return null; // Don't render if there's no dot
  }

  return (
    <Animated.View // Use Animated.View
      style={{
        position: 'absolute',
        left: `${noteDot[0]}%`,
        top: noteDot[1],
        width: 18, // Slightly larger for better visibility
        height: 18,
        borderRadius: 9,
        backgroundColor: noteDot[4] === 0 ? palette.noteDotOpen : palette.noteDotFretted,
        borderWidth: 2,
        borderColor: noteDot[4] === 0 ? palette.noteDotOpenBorder : palette.noteDotFrettedBorder,
        zIndex: 10, // Ensure dot displays above strings
        transform: [{ scale: scaleAnim }], // Apply scaling animation
      }}
    />
  );
};

export default Fretboard