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

const Fretboard: React.FC<FretboardProps> = ({ frets, strings, fretboardHeight, noteDot}) => {
  return (
    <View style={{ position: 'relative', width: '100%', height: fretboardHeight }}>
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
        backgroundColor: 'green',
      }}
    >
    </View>
  );
};

export default Fretboard