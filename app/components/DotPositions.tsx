
type NoteDot = [x: number, y: number, note: string, stringIndex: number, fretIndex: number];
type Note = string;

const ORIGINAL_STRING_VERTICAL_OFFSETS = [0, 0, 0, 0, 0, 0]; // Rolled back to 0 for mathematical centering. Was [0,0,0,0,0,-10]
const BASE_FRETBOARD_HEIGHT_FOR_OFFSETS = 140.0;
const ACTUAL_STRING_HEIGHTS = [1.4, 1.8, 2.2, 2.7, 3.5, 5]; // High E to Low E
// Each of the 6 strings has 13 notes (0-12 frets, where 0 is the open string)

const guitarNotes: Note[][] = [
  // 0th fret (open string)
  ["E","B","G","D","A","E"],
  // 1st fret
  ["F","C","G#","D#","A#","F"],
  // 2nd fret
  ["F#","C#","A","E","B","F#"],
  // 3rd fret
  ["G","D","A#","F","C","G"],
  // 4th fret
  ["G#","D#","B","F#","C#","G#"],
  // 5th fret
  ["A","E","C","G","D","A"],
  // 6th fret
  ["A#","F","C#","G#","D#","A#"],
  // 7th fret
  ["B","F#","D","A","E","B"],
  // 8th fret
  ["C","G","D#","A#","F","C"],
  // 9th fret
  ["C#","G#","E","B","F#","C#"],
  // 10th fret
  ["D","A","F","C","G","D"],
  // 11th fret
  ["D#","A#","F#","C#","G#","D#"],
  // 12th fret
  ["E","B","G","D","A","E"],
]

// Manually place a dot at a specific string and fret
function ManualDotPosition(
  fretboardHeight: number,
  numStrings: number,
  stringIndex: number,
  fretIndex: number,
  verticalOffset: number = 0,
  horizontalOffset: number = 0
): NoteDot {
  // Ensure indices are within valid ranges
  stringIndex = Math.max(0, Math.min(numStrings - 1, stringIndex));
  fretIndex = Math.max(0, Math.min(12, fretIndex));
  
  const noteStepx = 29;
  const FirstNoteX = 10;
  const DOT_SIZE = 16;
  
  // Each of the 6 strings has 13 notes (0-12 frets, where 0 is the open string)

  const marginPercent = 0.01;
  const usableHeight = (1 - 2 * marginPercent) * fretboardHeight;
  const gapCount = numStrings + 1;

  // stringIndex 0 (High E) is at the top, stringIndex 5 (Low E) is at the bottom.
  // This matches the visual rendering in Strings.tsx and the order of ORIGINAL_STRING_VERTICAL_OFFSETS.
  
  // Calculate string position (this positions the TOP of the string)
  const stringHeight = ACTUAL_STRING_HEIGHTS[stringIndex] || 2; // Use actual height for this string
  const stringTop = (marginPercent * fretboardHeight) + ((stringIndex + 1) / gapCount) * usableHeight - stringHeight / 2;
  
  // Position dot CENTERED on the string
  const stringMiddle = stringTop + (stringHeight / 2);
  
  // Apply vertical offset based on the string index
  let yOffset = verticalOffset;
  yOffset += getScaledStringOffset(stringIndex, fretboardHeight);
  
  const y = stringMiddle - (DOT_SIZE / 2) + yOffset;
  
  // X position (fret)
  let x;
  
  // Special case for fret 0 (open string) - position 10px to the left of fret 1
  if (fretIndex === 0) {
    // Calculate fret 1 position exactly as it would normally be calculated
    const fret1Position = ((FirstNoteX + 1 * noteStepx) / 100) * noteStepx;
    x = fret1Position - 10 - 1.5; // Add additional -1.5px offset for fret 0
  } else if (fretIndex === 1) {
    // Special case for fret 1 - apply a -8px horizontal offset
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 8;
  } else if (fretIndex === 2) {
    // Special case for fret 2 - apply a -10px horizontal offset
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 10;
  } else if (fretIndex === 3) {
    // Special case for fret 3 - apply a -12px horizontal offset
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 12;
  } else if (fretIndex === 4) {
    // Special case for fret 4 - apply a -14px horizontal offset
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 14;
  } else if (fretIndex === 5) {
    // Special case for fret 5 - apply a -15px horizontal offset
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 15;
  } else if (fretIndex === 6) {
    // Special case for fret 6 - apply a -17px horizontal offset
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 17;
  } else if (fretIndex === 7) {
    // Special case for fret 7 - apply a -19px horizontal offset
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 19;
  } else if (fretIndex === 8) {
    // Special case for fret 8 - apply a -20px horizontal offset
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 20;
  } else if (fretIndex === 9) {
    // Special case for fret 9 - apply a -22px horizontal offset
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 22;
  } else if (fretIndex === 10) {
    // Special case for fret 10 - apply a -24px horizontal offset
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 24;
  } else if (fretIndex === 11) {
    // Special case for fret 11 - apply a -26px horizontal offset
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 26;
  } else if (fretIndex === 12) {
    // Special case for fret 12 - apply a -27px horizontal offset
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 27;
  } else {
    // For frets 13+, apply a -8px horizontal offset for centering
    x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 8;
  }
  
  // Apply horizontal offset if provided
  x += horizontalOffset;
  
  const note = guitarNotes[fretIndex][stringIndex];  
  
  return [x, y, note, stringIndex, fretIndex];
}

function getScaledStringOffset(stringIndex: number, currentFretboardHeight: number): number {
  if (stringIndex < 0 || stringIndex >= ORIGINAL_STRING_VERTICAL_OFFSETS.length) {
    return 0; // Should not happen with valid stringIndex
  }
  const scaleFactor = currentFretboardHeight / BASE_FRETBOARD_HEIGHT_FOR_OFFSETS;
  return Math.round(ORIGINAL_STRING_VERTICAL_OFFSETS[stringIndex] * scaleFactor);
}

// Level configuration for progressive learning
// Levels 1-7: Low E string (string index 5)
// Levels 8-14: A string (string index 4)
// Level 15: E + A combined
// Levels 16-22: D string (string index 3)
// Levels 23-29: G string (string index 2)
// Level 30: D + G combined
// Levels 31-37: B string (string index 1)
// Levels 38-44: High E string (string index 0)
// Level 45: B + High E combined
// Level 46: Full Fretboard - All 6 strings
// Level structure: 1/4, 2/4, 1/4+2/4, 3/4, 4/4, 3/4+4/4, full
function getLevelConfig(level: number): { stringIndices: number[], fretRanges: [number, number][] } {
  // Low E string (string index 5)
  if (level === 1) return { stringIndices: [5], fretRanges: [[0, 3]] }; // 1/4 (frets 0-3)
  if (level === 2) return { stringIndices: [5], fretRanges: [[4, 6]] }; // 2/4 (frets 4-6)
  if (level === 3) return { stringIndices: [5], fretRanges: [[0, 3], [4, 6]] }; // 1/4 + 2/4 (frets 0-6)
  if (level === 4) return { stringIndices: [5], fretRanges: [[7, 9]] }; // 3/4 (frets 7-9)
  if (level === 5) return { stringIndices: [5], fretRanges: [[10, 12]] }; // 4/4 (frets 10-12)
  if (level === 6) return { stringIndices: [5], fretRanges: [[7, 9], [10, 12]] }; // 3/4 + 4/4 (frets 7-12)
  if (level === 7) return { stringIndices: [5], fretRanges: [[0, 12]] }; // Full string (frets 0-12)
  
  // A string (string index 4)
  if (level === 8) return { stringIndices: [4], fretRanges: [[0, 3]] }; // 1/4
  if (level === 9) return { stringIndices: [4], fretRanges: [[4, 6]] }; // 2/4
  if (level === 10) return { stringIndices: [4], fretRanges: [[0, 3], [4, 6]] }; // 1/4 + 2/4
  if (level === 11) return { stringIndices: [4], fretRanges: [[7, 9]] }; // 3/4
  if (level === 12) return { stringIndices: [4], fretRanges: [[10, 12]] }; // 4/4
  if (level === 13) return { stringIndices: [4], fretRanges: [[7, 9], [10, 12]] }; // 3/4 + 4/4
  if (level === 14) return { stringIndices: [4], fretRanges: [[0, 12]] }; // Full string
  
  // E + A combined (string indices 4 and 5)
  if (level === 15) return { stringIndices: [4, 5], fretRanges: [[0, 12]] }; // Both strings, full fretboard
  
  // D string (string index 3)
  if (level === 16) return { stringIndices: [3], fretRanges: [[0, 3]] }; // 1/4
  if (level === 17) return { stringIndices: [3], fretRanges: [[4, 6]] }; // 2/4
  if (level === 18) return { stringIndices: [3], fretRanges: [[0, 3], [4, 6]] }; // 1/4 + 2/4
  if (level === 19) return { stringIndices: [3], fretRanges: [[7, 9]] }; // 3/4
  if (level === 20) return { stringIndices: [3], fretRanges: [[10, 12]] }; // 4/4
  if (level === 21) return { stringIndices: [3], fretRanges: [[7, 9], [10, 12]] }; // 3/4 + 4/4
  if (level === 22) return { stringIndices: [3], fretRanges: [[0, 12]] }; // Full string
  
  // G string (string index 2)
  if (level === 23) return { stringIndices: [2], fretRanges: [[0, 3]] }; // 1/4
  if (level === 24) return { stringIndices: [2], fretRanges: [[4, 6]] }; // 2/4
  if (level === 25) return { stringIndices: [2], fretRanges: [[0, 3], [4, 6]] }; // 1/4 + 2/4
  if (level === 26) return { stringIndices: [2], fretRanges: [[7, 9]] }; // 3/4
  if (level === 27) return { stringIndices: [2], fretRanges: [[10, 12]] }; // 4/4
  if (level === 28) return { stringIndices: [2], fretRanges: [[7, 9], [10, 12]] }; // 3/4 + 4/4
  if (level === 29) return { stringIndices: [2], fretRanges: [[0, 12]] }; // Full string
  
  // D + G combined (string indices 2 and 3)
  if (level === 30) return { stringIndices: [2, 3], fretRanges: [[0, 12]] }; // Both strings, full fretboard
  
  // B string (string index 1)
  if (level === 31) return { stringIndices: [1], fretRanges: [[0, 3]] }; // 1/4
  if (level === 32) return { stringIndices: [1], fretRanges: [[4, 6]] }; // 2/4
  if (level === 33) return { stringIndices: [1], fretRanges: [[0, 3], [4, 6]] }; // 1/4 + 2/4
  if (level === 34) return { stringIndices: [1], fretRanges: [[7, 9]] }; // 3/4
  if (level === 35) return { stringIndices: [1], fretRanges: [[10, 12]] }; // 4/4
  if (level === 36) return { stringIndices: [1], fretRanges: [[7, 9], [10, 12]] }; // 3/4 + 4/4
  if (level === 37) return { stringIndices: [1], fretRanges: [[0, 12]] }; // Full string
  
  // High E string (string index 0)
  if (level === 38) return { stringIndices: [0], fretRanges: [[0, 3]] }; // 1/4
  if (level === 39) return { stringIndices: [0], fretRanges: [[4, 6]] }; // 2/4
  if (level === 40) return { stringIndices: [0], fretRanges: [[0, 3], [4, 6]] }; // 1/4 + 2/4
  if (level === 41) return { stringIndices: [0], fretRanges: [[7, 9]] }; // 3/4
  if (level === 42) return { stringIndices: [0], fretRanges: [[10, 12]] }; // 4/4
  if (level === 43) return { stringIndices: [0], fretRanges: [[7, 9], [10, 12]] }; // 3/4 + 4/4
  if (level === 44) return { stringIndices: [0], fretRanges: [[0, 12]] }; // Full string
  
  // B + High E combined (string indices 0 and 1)
  if (level === 45) return { stringIndices: [0, 1], fretRanges: [[0, 12]] }; // Both strings, full fretboard
  
  // Full Fretboard - All 6 strings
  if (level === 46) return { stringIndices: [0, 1, 2, 3, 4, 5], fretRanges: [[0, 12]] }; // All strings, full fretboard
  
  // Default fallback - full Low E string
  return { stringIndices: [5], fretRanges: [[0, 12]] };
}

// Original random dot generator, with optional manual position
function GenDotList(
  fretboardHeight: number,
  numStrings: number,
  difficulty: number,
  manualString?: number,
  manualFret?: number,
  verticalOffset: number = 0,
  fullList?: boolean 
) {
  // If manual position is specified, use that instead of random
  if (manualString !== undefined && manualFret !== undefined ) {
    return ManualDotPosition(fretboardHeight, numStrings, manualString, manualFret, verticalOffset);
  }

  const noteStepx = 29;
  const FirstNoteX = 10;
  const DOT_SIZE = 16;

  // Match Strings.tsx EXACTLY
  const marginPercent = 0.01;
  const usableHeight = (1 - 2 * marginPercent) * fretboardHeight;
  const gapCount = numStrings + 1;

  // Get level-specific configuration
  const levelConfig = getLevelConfig(difficulty + 1); // difficulty is 0-indexed, levels are 1-indexed
  
  // Build list of valid positions based on level configuration
  const listOfPositions: { stringIndex: number; fretIndex: number }[] = [];
  for (const stringIndex of levelConfig.stringIndices) {
    for (const [minFret, maxFret] of levelConfig.fretRanges) {
      for (let fret = minFret; fret <= maxFret; fret++) {
        listOfPositions.push({ stringIndex, fretIndex: fret });
      }
    }
  }

  const dotCoordinates = listOfPositions.map((pos) => {
    const fretIndex = pos.fretIndex;
    const stringIndex = pos.stringIndex;
    // stringIndex 0 (High E) is at the top, stringIndex 5 (Low E) is at the bottom.
    // This matches the visual rendering in Strings.tsx and the order of ORIGINAL_STRING_VERTICAL_OFFSETS.
    
    // Use EXACT same formula as in Strings.tsx
    const stringHeight = ACTUAL_STRING_HEIGHTS[stringIndex] || 2; // Use actual height for this string
    const stringTop = (marginPercent * fretboardHeight) + ((stringIndex + 1) / gapCount) * usableHeight - stringHeight / 2;
    
    // Position dot CENTERED on the string (middle of dot over middle of string)
    // For perfect centering: string's center position - half the dot's height
    const stringMiddle = stringTop + (stringHeight / 2); // Middle of the string
    
    // Apply vertical offset based on the string index
    let yOffset = verticalOffset; // verticalOffset is the function parameter
    yOffset += getScaledStringOffset(stringIndex, fretboardHeight);
    
    const y = stringMiddle - (DOT_SIZE / 2) + yOffset;
    
    // X position (fret)
    let x;
    
    // Special case for fret 0 (open string) - position 10px to the left of fret 1
    if (fretIndex === 0) {
      // Calculate fret 1 position exactly as it would normally be calculated
      const fret1Position = ((FirstNoteX + 1 * noteStepx) / 100) * noteStepx;
      x = fret1Position - 10 - 1.5; // Add additional -1.5px offset for fret 0
    } else if (fretIndex === 1) {
      // Special case for fret 1 - apply a -8px horizontal offset
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 8;
    } else if (fretIndex === 2) {
      // Special case for fret 2 - apply a -10px horizontal offset
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 10;
    } else if (fretIndex === 3) {
      // Special case for fret 3 - apply a -12px horizontal offset
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 12;
    } else if (fretIndex === 4) {
      // Special case for fret 4 - apply a -14px horizontal offset
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 14;
    } else if (fretIndex === 5) {
      // Special case for fret 5 - apply a -15px horizontal offset
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 15;
    } else if (fretIndex === 6) {
      // Special case for fret 6 - apply a -17px horizontal offset
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 17;
    } else if (fretIndex === 7) {
      // Special case for fret 7 - apply a -19px horizontal offset
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 19;
    } else if (fretIndex === 8) {
      // Special case for fret 8 - apply a -20px horizontal offset
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 20;
    } else if (fretIndex === 9) {
      // Special case for fret 9 - apply a -22px horizontal offset
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 22;
    } else if (fretIndex === 10) {
      // Special case for fret 10 - apply a -24px horizontal offset
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 24;
    } else if (fretIndex === 11) {
      // Special case for fret 11 - apply a -26px horizontal offset
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 26;
    } else if (fretIndex === 12) {
      // Special case for fret 12 - apply a -27px horizontal offset
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 27;
    } else {
      // For frets 13+, apply a -8px horizontal offset for centering
      x = ((FirstNoteX + fretIndex * noteStepx) / 100) * noteStepx - 8;
    }
    
    const note = guitarNotes[fretIndex][stringIndex]

    return [x, y, note, stringIndex, fretIndex]
  });

  if (fullList) {
    return dotCoordinates as any
  }
    return dotCoordinates[Math.floor(Math.random() * dotCoordinates.length)] as NoteDot

}

export default GenDotList
export { ManualDotPosition }
export type { NoteDot }
export type { Note }