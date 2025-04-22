import React from "react";
import { View } from "react-native";

interface StringsProps {
  strings: number[];
  fretboardHeight: number;
}

const Strings: React.FC<StringsProps> = ({ strings, fretboardHeight }) => {
  return (
    <>
      {strings.map((string: number, i: number) => {
        // 5% margin at top/bottom so strings don't touch the edge
        const marginPercent = 0.05;
        const usableHeight = (1 - 2 * marginPercent) * fretboardHeight;
        const top = (marginPercent * fretboardHeight) + (i / (strings.length - 1)) * usableHeight;
        return (
          <View
            key={string}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top,
              height: 2,
              backgroundColor: 'black',
            }}
          />
        );
      })}
    </>
  );
};

export default Strings;
