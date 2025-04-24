import React from "react"
import Frets from "./Frets"
import Strings from "./Strings"
import FretDots from "./FretDots"
import { View } from "react-native"

interface FretboardProps {
  frets: number[]
  strings: number[]
  fretboardHeight: number
  
}

function GenerateList() {
  const noteStepx = 29
  const noteStepy = 36
  const numberOfPositions = 72
  const oneStringPositions = 12
  const FirstNoteX = 10
  const FirstNoteY = 0

  const listOfPositions = Array.from({ length: numberOfPositions }, (_, index) => index)
  const dotCoordinates = listOfPositions.map((position) => {
    const x = ((FirstNoteX + (position % oneStringPositions) * noteStepx) / 100) * noteStepx
    const y = FirstNoteY + Math.floor(position / oneStringPositions) * noteStepy
    return [x, y];
  });
  const randomIndex = Math.floor(Math.random() * dotCoordinates.length);
  return dotCoordinates[randomIndex];
}

const Fretboard: React.FC<FretboardProps> = ({ frets, strings, fretboardHeight }) => {
  return (
    <View style={{ position: 'relative', width: '100%', height: fretboardHeight }}>
      {/* Strings (horizontal lines) */}
      <Strings strings={strings} fretboardHeight={fretboardHeight} />
      {/* Dots */}
      <FretDots frets={frets} fretboardHeight={fretboardHeight} />
      {/* Frets (vertical lines) */}
      <Frets frets={frets} />
      {/* Random note dots */}
      <DrawNoteDot />
    </View>
  );
};
const DrawNoteDot = () => {
  const [x, y] = GenerateList();
  return (
    <View
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: y,
        width: 20,
        height: 20,
        borderRadius: 5,
        backgroundColor: 'green',
      }}
    />
  );
};

export default Fretboard;