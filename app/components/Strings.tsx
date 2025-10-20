import React from "react";
import { View } from "react-native";
import { ThemeName, ThemePalette } from '../ThemeContext';

interface StringsProps {
  strings: number[];
  fretboardHeight: number;
  themeName: ThemeName;
  stringColors: string[];
  palette: ThemePalette; // Added palette
  useColoredStrings?: boolean; // Option to use colored strings
}

// Steel-like string colors (realistic metallic tones with better contrast)
const STEEL_STRING_COLORS = [
  '#6B6B6B', // Low E - Dark steel gray (thickest string)
  '#7A7A7A', // A - Medium dark steel
  '#8A8A8A', // D - Medium steel
  '#9B9B9B', // G - Medium light steel
  '#ABABAB', // B - Light steel
  '#BCBCBC', // High E - Lightest steel (thinnest string)
];

const Strings: React.FC<StringsProps> = ({ strings, fretboardHeight, themeName, stringColors, palette, useColoredStrings = false }) => { // Added useColoredStrings
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
        // Use steel colors by default, or themed colors if option is enabled
        const stringColor = useColoredStrings ? stringColors[i % stringColors.length] : STEEL_STRING_COLORS[i];
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
              shadowColor: useColoredStrings ? palette.shadow : '#000000',
              shadowOffset: { width: 0, height: stringHeight > 3 ? 2 : 1 },
              shadowOpacity: useColoredStrings ? 0.4 : 0.6,
              shadowRadius: useColoredStrings ? 2 : 3,
              elevation: useColoredStrings ? 2 : 3,
              // Add subtle top border to simulate steel shine/highlight
              borderTopWidth: useColoredStrings ? 0 : (stringHeight > 2 ? 0.5 : 0),
              borderTopColor: useColoredStrings ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
            }}
          />
        );
      })}
    </>
  );
};

export default Strings;
