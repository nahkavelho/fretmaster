import React from "react"
import Frets from "./Frets"
import Strings from "./Strings"
import FretDots from "./FretDots"
import { View } from "react-native"

interface FretboardProps {
  frets: number[]
  strings: number[]
  fretboardHeight: number
  noteDot: [x: number, y: number, note: string, stringIndex: number, fretIndex: number]
}

interface DrawNoteDotProps {
  noteDot: [x: number, y: number, note: string, stringIndex: number, fretIndex: number]
}

// Theme browns
const BROWN_BG = '#74512D'; // mid brown, matches Free Mode/menu/fret dots
const BORDER = '#AF8F6F'; // tan border

const Fretboard: React.FC<FretboardProps> = ({ frets, strings, fretboardHeight, noteDot}) => {
  return (
    <View style={{ position: 'relative', width: '100%', height: fretboardHeight, backgroundColor: BROWN_BG, borderRadius: 16, borderWidth: 4, borderColor: BORDER, overflow: 'hidden' }}>
      {/* Guitar Nut (white bar at the left edge) */}
      <View
        style={{
          position: 'absolute',
          left: '0%',
          top: 0,
          bottom: 0,
          width: 8,
          backgroundColor: '#FFFFFF',
          zIndex: 5, // Above the fretboard, below the dots
        }}
      />
      {/* Strings (horizontal lines) */}
      <Strings strings={strings} fretboardHeight={fretboardHeight} />
      {/* Dots */}
      <FretDots frets={frets} fretboardHeight={fretboardHeight} />
      {/* Frets (vertical lines) */}
      <Frets frets={frets} />
      {/* Random note dots */}
      <DrawNoteDot noteDot={noteDot} />
    </View>
  );
};

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
  );
};

export default Fretboard