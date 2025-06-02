import React from "react"
import Frets from "./Frets"
import Strings from "./Strings"
import FretDots from "./FretDots"
import { View } from "react-native"
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
  return (
    <View
      style={{
        position: 'absolute',
        left: `${noteDot[0]}%`,
        top: noteDot[1],
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#F8F4E1', // cream dot for contrast
        borderWidth: 2,
        borderColor: '#543310', // deep brown border
        zIndex: 10, // Ensure dot displays above strings
      }}
    >
    </View>
  )
}

export default Fretboard