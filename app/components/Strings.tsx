import React from "react";
import { View } from "react-native";
import { ROCKSMITH_STRING_COLORS } from '../_layout';

interface StringsProps {
  strings: number[];
  fretboardHeight: number;
  theme?: 'light' | 'dark' | 'rocksmith';
}

import { ThemeContext } from '../_layout';

const Strings: React.FC<StringsProps> = ({ strings, fretboardHeight, theme: themeProp }) => {
  const { theme } = React.useContext(ThemeContext);
  const activeTheme = themeProp || theme;
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
        const stringColor = activeTheme === 'rocksmith' ? ROCKSMITH_STRING_COLORS[i % 6] : '#C0C0C0';
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
              shadowColor: activeTheme === 'rocksmith' ? '#222' : '#543310',
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
