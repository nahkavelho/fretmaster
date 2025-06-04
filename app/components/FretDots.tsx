import React, { useContext } from "react";
import { View } from "react-native";
import { ThemeContext } from '../_layout';

interface FretDotsProps {
  frets: number[];
  fretboardHeight: number;
}

// Only display dots at 3, 5, 7, 9 (single) and 12 (double)
const dotFrets = [3, 5, 7, 9];
const doubleDotFrets = [12];

const FretDots: React.FC<FretDotsProps> = ({ frets, fretboardHeight }) => {
  const { theme } = useContext(ThemeContext);
  const dotSize = 16; // Smaller dot size for more realistic fretboard dots
  // Use the same symmetrical gap logic as strings for vertical centering
  const marginPercent = 0.01;
  const usableHeight = (1 - 2 * marginPercent) * fretboardHeight;
  // Place fretboard dots at exact center
  const stringCount = 6; // Standard guitar has 6 strings
  const centerY = fretboardHeight / 2 - dotSize / 2;

  return (
    <>
      {frets.map((fret, i) => {
        if (!dotFrets.includes(fret) && !doubleDotFrets.includes(fret)) return null;
        // Adjust horizontal position to be centered between frets
        const left = ((i + 0.5) / frets.length) * 100;

        if (doubleDotFrets.includes(fret)) {
          // For double dots (12th fret), place them at 3rd and 4th string positions
          const string3Pos = (marginPercent * fretboardHeight) + ((2.5) / (stringCount + 1)) * usableHeight - dotSize / 2;
          const string4Pos = (marginPercent * fretboardHeight) + ((4.5) / (stringCount + 1)) * usableHeight - dotSize / 2;
          
          return (
            <React.Fragment key={`dot-double-${fret}`}>
              <View
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: string3Pos,
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: theme === 'rocksmith' ? '#FFD900' : theme === 'dark' ? '#FFF' : '#333',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: string4Pos,
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: theme === 'rocksmith' ? '#FFD900' : theme === 'dark' ? '#FFF' : '#333',
                }}
              />
            </React.Fragment>
          );
        }
        // Single dot - centered vertically
        return (
          <View
            key={`dot-${fret}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: centerY,
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: theme === 'rocksmith' ? '#FFD900' : theme === 'dark' ? '#FFF' : '#333',
            }}
          />
        );
      })}
    </>
  );
};

export default FretDots;
