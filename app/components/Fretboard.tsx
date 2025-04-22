import React from "react";
import Frets from "./Frets";
import Strings from "./Strings";
import FretDots from "./FretDots";
import { View } from "react-native";

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
    </View>
  );
};

export default Fretboard;
