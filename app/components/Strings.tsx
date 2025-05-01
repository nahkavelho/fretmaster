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
        // Clamp string center so string stays within the box
        const stringHeight = i === strings.length - 1 ? 4 : 2;
        // Adjust so string is always inside the box, not over
        const top = (marginPercent * fretboardHeight) + (i / (strings.length - 1)) * usableHeight - stringHeight / 2;
        const isLast = i === strings.length - 1;
        return (
          <View
            key={string}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top,
              height: stringHeight,
              backgroundColor: '#C0C0C0', // all strings silver
              shadowColor: '#543310', // deep brown shadow
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.4,
              shadowRadius: 2,
              elevation: 2,
            }}
          />
        );
      })}
    </>
  );
};

export default Strings;
