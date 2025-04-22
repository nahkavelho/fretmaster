import React from "react";
import Frets from "./Frets";
import Strings from "./Strings";
import FretDots from "./FretDots";
import { View } from "react-native";
import { dot } from "node:test/reporters";

interface FretboardProps {
  frets: number[];
  strings: number[];
  fretboardHeight: number;
  
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
      <RandomNodeDot />
    </View>
  );
};
const RandomNodeDot = () => {
  const noteStepx = 34.5;
  const noteStepy = 36;
  const numberOfPositions = 72;
  const oneStringPositions = 12;
  const FirstNoteX = 10;
  const FirstNoteY = 0;

  const listOfPositions = Array.from({ length: numberOfPositions }, (_, index) => index);
  const dotCordinates = listOfPositions.map((position) => {
    const x = FirstNoteX + (position % oneStringPositions) * noteStepx;
    const y = FirstNoteY + Math.floor(position / oneStringPositions) * noteStepy;
    return [x, y];


  });
  
  return (
    <>
      {dotCordinates.map((dot, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: dot[0],
            top: dot[1],
            width: 20,
            height: 20,
            borderRadius: 5,
            backgroundColor: 'green',
          }}
        />
      ))}
    </>
  );
};

export default Fretboard;
