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
}

interface DrawNoteDotProps {
  noteDot: [x: number, y: number, note: string, stringIndex: number, fretIndex: number]
}

// Theme browns
const BROWN_BG = '#74512D'; // mid brown, matches Free Mode/menu/fret dots
const BORDER = '#AF8F6F'; // tan border
// area that is not in use by dufficulties
const UNUSED_AREA_COLOR = '#C0C0C0';

import { ThemeContext } from '../_layout';

const Fretboard: React.FC<FretboardProps> = ({ frets, strings, fretboardHeight, noteDot, difficulty }) => {
  const { theme } = React.useContext(ThemeContext);

    const max_difficulty = 12;
    const screenWidth = Dimensions.get('window').width;
    const percent = Math.min(100, Math.max(0, (difficulty / max_difficulty) * 100));
    const usedWidth = (percent / 100) * screenWidth;
    const bgColor = theme === 'rocksmith' ? '#181A1B' : UNUSED_AREA_COLOR;
    const borderColor = theme === 'rocksmith' ? '#444' : BORDER;
    const nutColor = theme === 'rocksmith' ? '#232526' : BROWN_BG;
  return (
    <View style={{ position: 'relative', width: '100%', height: fretboardHeight, backgroundColor: bgColor, borderRadius: 16, borderWidth: 4, borderColor: borderColor }}>
      {/* Guitar Nut (white bar at the left edge) */}
      <View style={{ position: 'absolute', left: 0, top: 0, width: usedWidth, height: fretboardHeight, backgroundColor: nutColor }} />
      {/* Strings (horizontal lines) */}
      <Strings strings={strings} fretboardHeight={fretboardHeight} theme={theme} />
      {/* Dots */}
      <FretDots frets={frets} fretboardHeight={fretboardHeight} />
      {/* Frets (vertical lines) */}
      <Frets frets={frets} />
      {/* Random note dots */}
      <DrawNoteDot noteDot={noteDot} />
    </View>
  )
}

const DrawNoteDot: React.FC<DrawNoteDotProps> = ({ noteDot }) => {
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
        backgroundColor: '#FFD700', // Brighter gold color
        borderWidth: 2,
        borderColor: '#b8860b', // Darker gold/brown border for contrast
        zIndex: 10, // Ensure dot displays above strings
        transform: [{ scale: scaleAnim }], // Apply scaling animation
      }}
    />
  );
};

export default Fretboard