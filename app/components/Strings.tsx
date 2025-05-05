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
        // 1% margin at top/bottom so strings don't touch the edge
        const marginPercent = 0.01; // Reduce margin for wider string spacing
        // Make the strings fully symmetrical: use N+1 gaps for N strings
        const usableHeight = (1 - 2 * marginPercent) * fretboardHeight;
        const stringHeight = 2; // Use a constant string thickness for better alignment
        // Place strings at (k / (strings.length + 1)) for k=1..N
        const renderedIndex = (strings.length - 1) - i;
        const gapCount = strings.length + 1;
        const top = (marginPercent * fretboardHeight) + ((renderedIndex + 1) / gapCount) * usableHeight - stringHeight / 2;
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
