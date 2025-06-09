import React from "react";
import { View } from "react-native";
import { ROCKSMITH_STRING_COLORS } from '../_layout';

interface StringsProps {
  strings: number[];
  fretboardHeight: number;
  themeName: ThemeName;
  stringColors: string[];
  palette: ThemePalette; // Added palette
}

import { ThemeName, ThemePalette } from '../_layout'; // Added ThemePalette

const Strings: React.FC<StringsProps> = ({ strings, fretboardHeight, themeName, stringColors, palette }) => { // Added palette
  return (
    <>
      {strings.map((string: number, i: number) => {
        // 1% margin at top/bottom so strings don't touch the edge
        const marginPercent = 0.01; // Reduce margin for wider string spacing
        // Make the strings fully symmetrical: use N+1 gaps for N strings
        const usableHeight = (1 - 2 * marginPercent) * fretboardHeight;
        // Make all strings thicker, decreasing stepwise from bottom (i==0) to top (i==5)
        const stringHeights = [5, 3.5, 2.7, 2.2, 1.8, 1.4];
        const stringHeight = stringHeights[i] || 2;
        // Place strings at (k / (strings.length + 1)) for k=1..N
        const renderedIndex = (strings.length - 1) - i;
        const gapCount = strings.length + 1;
        const top = (marginPercent * fretboardHeight) + ((renderedIndex + 1) / gapCount) * usableHeight - stringHeight / 2;
        const stringColor = stringColors[i % stringColors.length];
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top,
              height: stringHeight,
              backgroundColor: stringColor,
              shadowColor: palette.shadow,
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
