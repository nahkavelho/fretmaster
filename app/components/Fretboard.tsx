import React from "react"
import Frets from "./Frets"
import Strings from "./Strings"
import FretDots from "./FretDots"
import { View } from "react-native"

interface FretboardProps {
  frets: number[]
  strings: number[]
  fretboardHeight: number
  noteDot: [x: number, y: number, note: string]
}

interface DrawNoteDotProps {
  noteDot: [x: number, y: number, note: string]
}

// Theme browns
const BROWN_BG = '#74512D'; // mid brown, matches Free Mode/menu/fret dots
const BORDER = '#AF8F6F'; // tan border

// Theme browns
const BROWN_BG = '#74512D'; // mid brown, matches Free Mode/menu/fret dots
const BORDER = '#AF8F6F'; // tan border

const Fretboard: React.FC<FretboardProps> = ({ frets, strings, fretboardHeight, noteDot}) => {
  return (
    <View style={{ position: 'relative', width: '100%', height: fretboardHeight, backgroundColor: BROWN_BG, borderRadius: 16, borderWidth: 4, borderColor: BORDER, overflow: 'hidden' }}>
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
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F8F4E1', // cream dot for contrast
        borderWidth: 2,
        borderColor: '#543310', // deep brown border
      }}
    >
    </View>
  );
};

export default Fretboard