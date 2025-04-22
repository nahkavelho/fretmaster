import React from "react";
import { View } from "react-native";

interface FretDotsProps {
  frets: number[];
  fretboardHeight: number;
}

// Only display dots at 3, 5, 7, 9 (single) and 12 (double)
const dotFrets = [3, 5, 7, 9];
const doubleDotFrets = [12];

const FretDots: React.FC<FretDotsProps> = ({ frets, fretboardHeight }) => {
  const dotSize = 20;
  // By default, dots are vertically centered. Adjust offset to move up/down:
  const centerY = fretboardHeight / 2 - dotSize / 2 + 0;

  return (
    <>
      {frets.map((fret, i) => {
        if (!dotFrets.includes(fret) && !doubleDotFrets.includes(fret)) return null;
        // To adjust horizontal position, edit the 'left' calculation below
        const left = ((i + 0.4) / frets.length) * 100; // Horizontal position as % of fretboard width

        if (doubleDotFrets.includes(fret)) {
          // Double dots (12): stack two dots vertically
          // Adjust the +/- 37 values below to change the vertical spacing between double dots
          return (
            <React.Fragment key={`dot-double-${fret}`}>
              <View
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: centerY - 37,
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: '#333',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: centerY + 37,
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: '#333',
                }}
              />
            </React.Fragment>
          );
        }
        // Single dot
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
              backgroundColor: '#333',
            }}
          />
        );
      })}
    </>
  );
};

export default FretDots;
